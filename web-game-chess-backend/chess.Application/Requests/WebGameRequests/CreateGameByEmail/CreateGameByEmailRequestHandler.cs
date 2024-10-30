
using chess.Application.Repositories;
using chess.Application.Repositories.UserRepositories;
using chess.Application.Repositories.WebGameRepositories;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Core.Enums;
using chess.Core.Maps.MapOfElo;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.WebGameRequests.CreateGameByEmail;

/// <summary>
/// Checks if current user exists
/// Checks if user with provided email exists
/// Checks if provided data is correct
/// Checks if game timing exists and if not creates one
/// Creates players for both current user and provided friend
/// Creates new game and associated game state
/// Creates new invitation for created game
/// Sends invitation to friend email
/// Returns essential for further actions
/// </summary>
public class CreateGameByEmailRequestHandler : IRequestHandler<CreateGameByEmailRequest, CreateGameByEmailDto> {

    private readonly IUserContextService _userContextService;
    private readonly IUserRepository _userRepository;
    private readonly IWebGameRepository _gameRepository;
    private readonly IGameTimingRepository _gameTimingRepository;
    private readonly IWebGameStateRepository _gameStateRepository;
    private readonly IWebGamePlayerRepository _playerRepository;
    private readonly IWebGameInvitationRepository _gameInvitationRepository;
    private readonly ISmtpService _smtpService;

    public CreateGameByEmailRequestHandler(
        IUserContextService userContextService,
        IUserRepository userRepository,
        IWebGameRepository gameRepository,
        IGameTimingRepository gameTimingRepository,
        IWebGameStateRepository gameStateRepository,
        IWebGamePlayerRepository playerRepository,
        IWebGameInvitationRepository gameInvitationRepository,
        ISmtpService smtpService
    ) {
        _userContextService = userContextService;
        _userRepository = userRepository;
        _gameRepository = gameRepository;
        _gameTimingRepository = gameTimingRepository;
        _gameStateRepository = gameStateRepository;
        _playerRepository = playerRepository;
        _gameInvitationRepository = gameInvitationRepository;
        _smtpService = smtpService;
    }

    public async Task<CreateGameByEmailDto> Handle(CreateGameByEmailRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var user = await _userRepository.GetById(userId)
            ?? throw new NotFoundException("User not found.");

        var friend = await _userRepository.GetByEmail(request.Email)
             ?? throw new NotFoundException("Friend not found.");

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
        var userPlayer = new WebGamePlayer()
        {
            Id = Guid.NewGuid(),
            IsPrivate = true,
            Name = user.Username,
            Elo = userElo,
            TimeLeft = request.Minutes * 60,
            UserId = userId,
            TimingId = timing!.Id,
        };

        int friendElo = friend.Elo.GetElo(request.Type);
        var friendPlayer = new WebGamePlayer()
        {
            Id = Guid.NewGuid(),
            IsPrivate = true,
            Name = friend.Username,
            Elo = friendElo,
            TimeLeft = request.Minutes * 60,
            UserId = friend.Id,
            TimingId = timing!.Id,
        };


        await _playerRepository.Create(userPlayer);
        await _playerRepository.Create(friendPlayer);


        var game = new WebGame()
        {
            Id = Guid.NewGuid(),
            IsPrivate = true,
            TimingType = timing.Type,
            GameTimingId = timing!.Id,

            WhitePlayerRegistered = false,
            BlackPlayerRegistered = false,
        };

        userPlayer.GameId = game.Id;
        friendPlayer.GameId = game.Id;

        var random = new Random();
        var randomChoice = random.Next(2) == 0;
        game.WhitePlayerId = randomChoice ? userPlayer.Id : friendPlayer.Id;
        game.BlackPlayerId = randomChoice ? friendPlayer.Id : userPlayer.Id;

        game.WhitePlayerRegistered = true;
        game.BlackPlayerRegistered = true;

        userPlayer.Color = randomChoice ? PieceColor.White : PieceColor.Black;
        friendPlayer.Color = randomChoice ? PieceColor.Black : PieceColor.White;

        var gameState = new WebGameState()
        {
            Id = Guid.NewGuid(),
            GameId = game.Id,
        };

        var invitation = new WebGameInvitation()
        {
            Id = Guid.NewGuid(),
            InviterId = userId,
            InviterName = user.Username,
            InviteeId = friend.Id,
            InviteeName = friend.Username,
            Type = request.Type,
            GameId = game.Id,
        };


        await _gameRepository.Create(game);
        await _gameStateRepository.Create(gameState);
        await _gameInvitationRepository.Create(invitation);


        var privateGameDto = new CreateGameByEmailDto()
        {
            FriendId = friend.Id,
            GameId = game.Id,
            Inviter = user.Username,
        };


        await _smtpService.SendGameInvitation(friend.Email.ToLower(), friend.Username, user.Username);


        return privateGameDto;
    }
}
