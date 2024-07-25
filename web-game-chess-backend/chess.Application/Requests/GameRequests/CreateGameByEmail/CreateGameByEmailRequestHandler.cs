
using chess.Application.Repositories;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Core.Enums;
using chess.Core.Extensions;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.GameRequests.CreateGameByEmail;

public class CreateGameByEmailRequestHandler : IRequestHandler<CreateGameByEmailRequest, CreateGameByEmailDto> {

    private readonly IUserContextService _userContextService;
    private readonly IUserRepository _userRepository;
    private readonly IGameRepository _gameRepository;
    private readonly IGameTimingRepository _gameTimingRepository;
    private readonly IGameStateRepository _gameStateRepository;
    private readonly IPlayerRepository _playerRepository;
    private readonly IInvitationRepository _invitationRepository;
    private readonly ISmtpService _smtpService;

    public CreateGameByEmailRequestHandler(
        IUserContextService userContextService,
        IUserRepository userRepository,
        IGameRepository gameRepository,
        IGameTimingRepository gameTimingRepository,
        IGameStateRepository gameStateRepository,
        IPlayerRepository playerRepository,
        IInvitationRepository invitationRepository,
        ISmtpService smtpService
    ) {
        _userContextService = userContextService;
        _userRepository = userRepository;
        _gameRepository = gameRepository;
        _gameTimingRepository = gameTimingRepository;
        _gameStateRepository = gameStateRepository;
        _playerRepository = playerRepository;
        _invitationRepository = invitationRepository;
        _smtpService = smtpService;
    }

    public async Task<CreateGameByEmailDto> Handle(CreateGameByEmailRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var user = await _userRepository.GetById(userId)
            ?? throw new NotFoundException("User not found.");

        var friend = await _userRepository.GetByEmail(request.Email)
             ?? throw new NotFoundException("Friend not found.");

        if (request.Minutes == 0)
            throw new BadRequestException("Incorrect minutes value.");

        var existingGameTiming = await _gameTimingRepository.FindTiming(request.Type, request.Minutes * 60, request.Increment);

        var timing = existingGameTiming;
        if (existingGameTiming is null) {

            var gameTiming = new GameTiming()
            {
                Id = Guid.NewGuid(),
                Type = request.Type,
                Seconds = request.Minutes * 60,
                Increment = request.Increment,
            };

            await _gameTimingRepository.Create(gameTiming);

            timing = gameTiming;

        }

        int userElo = user.Elo.GetElo(request.Type);
        var userPlayer = new Player()
        {
            Id = Guid.NewGuid(),
            Name = user.Username,
            ImageUrl = user.ImageUrl,
            Elo = userElo,
            TimeLeft = request.Minutes * 60,
            UserId = userId,
            TimingId = timing!.Id,
        };


        await _playerRepository.Create(userPlayer);

        int friendElo = friend.Elo.GetElo(request.Type);
        var friendPlayer = new Player()
        {
            Id = Guid.NewGuid(),
            Name = friend.Username,
            ImageUrl = friend.ImageUrl,
            Elo = friendElo,
            TimeLeft = request.Minutes * 60,
            UserId = friend.Id,
            TimingId = timing!.Id,
        };


        await _playerRepository.Create(friendPlayer);


        var game = new Game()
        {
            Id = Guid.NewGuid(),
            IsPrivate = true,
            TimingType = timing.Type,
            GameTimingId = timing!.Id,
        };

        userPlayer.GameId = game.Id;
        friendPlayer.GameId = game.Id;

        var random = new Random();
        var randomChoice = random.Next(2) == 0;
        game.WhitePlayerId = randomChoice ? userPlayer.Id : friendPlayer.Id;
        game.BlackPlayerId = randomChoice ? friendPlayer.Id : userPlayer.Id;

        userPlayer.Color = randomChoice ? Colors.White : Colors.Black;
        friendPlayer.Color = randomChoice ? Colors.Black : Colors.White;


        await _gameRepository.Create(game);

        var gameState = new GameState()
        {
            Id = Guid.NewGuid(),
            GameId = game.Id,
        };


        await _gameStateRepository.Create(gameState);


        var invitation = new Invitation()
        {
            Id = Guid.NewGuid(),
            InvitorId = userId,
            InvitorName = user.Username,
            InviteeId = friend.Id,
            InviteeName = friend.Username,
            Type = request.Type,
            GameId = game.Id,
        };


        await _invitationRepository.Create(invitation);


        var privateGameDto = new CreateGameByEmailDto()
        {
            FriendId = friend.Id,
            GameId = game.Id,
            Inviter = user.Username,
        };


        await _smtpService.SendGameInvitation(request.Email.ToLower(), friend.Username, user.Username);


        return privateGameDto;
    }
}
