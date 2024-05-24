
using chess.Application.Repositories;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Core.Enums;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.GameRequests.CreatePrivateGame;

public class CreatePrivateGameRequestHandler : IRequestHandler<CreatePrivateGameRequest, CreatePrivateGameDto> {

    private readonly IUserContextService _userContextService;
    private readonly IUserRepository _userRepository;
    private readonly IGameRepository _gameRepository;
    private readonly IGameTimingRepository _gameTimingRepository;
    private readonly IGameStateRepository _gameStateRepository;
    private readonly IPlayerRepository _playerRepository;
    private readonly IFriendshipRepository _friendshipRepository;

    public CreatePrivateGameRequestHandler(
        IUserContextService userContextService,
        IUserRepository userRepository,
        IGameRepository gameRepository,
        IGameTimingRepository gameTimingRepository,
        IGameStateRepository gameStateRepository,
        IPlayerRepository playerRepository,
        IFriendshipRepository friendshipRepository
    ) {
        _userContextService = userContextService;
        _userRepository = userRepository;
        _gameRepository = gameRepository;
        _gameTimingRepository = gameTimingRepository;
        _gameStateRepository = gameStateRepository;
        _playerRepository = playerRepository;
        _friendshipRepository = friendshipRepository;
    }

    public async Task<CreatePrivateGameDto> Handle(CreatePrivateGameRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var user = await _userRepository.GetById(userId)
            ?? throw new NotFoundException("User not found.");

        var firendship = await _friendshipRepository.GetById(request.FriendshipId)
               ?? throw new NotFoundException("Friendship not found.");

        var friendId = userId == firendship.RequestorId ? firendship.ReceiverId : firendship.RequestorId;

        var friend = await _userRepository.GetById(friendId)
             ?? throw new NotFoundException("Friend not found.");

        if (request.Minutes == 0)
            throw new BadRequestException("Incorrect minutes value.");

        var existingGameTiming = await _gameTimingRepository.FindTiming(request.Type, request.Minutes, request.Increment);

        var timing = existingGameTiming;
        if (existingGameTiming is null) {

            var gameTiming = new GameTiming()
            {
                Id = Guid.NewGuid(),
                Type = request.Type,
                Minutes = request.Minutes,
                Increment = request.Increment,
            };

            await _gameTimingRepository.Create(gameTiming);

            timing = gameTiming;

        }

        var userPlayer = new Player()
        {
            Id = Guid.NewGuid(),
            Name = user.Username,
            ImageUrl = user.ImageUrl,
            Elo = user.Elo,
            TimeLeft = request.Minutes,
            UserId = userId,
            TimingId = timing!.Id,
        };


        await _playerRepository.Create(userPlayer);


        var friendPlayer = new Player()
        {
            Id = Guid.NewGuid(),
            Name = friend.Username,
            ImageUrl = friend.ImageUrl,
            Elo = friend.Elo,
            TimeLeft = request.Minutes,
            UserId = friend.Id,
            TimingId = timing!.Id,
        };


        await _playerRepository.Create(friendPlayer);


        var gameState = new GameState()
        {
            Id = Guid.NewGuid(),
        };


        await _gameStateRepository.Create(gameState);


        var game = new Game()
        {
            Id = Guid.NewGuid(),
            IsPrivate = true,
            TimingType = timing.Type,
            GameTimingId = timing!.Id,
            GameStateId = gameState.Id,
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

        var privateGameDto = new CreatePrivateGameDto()
        {
            FriendId = friendId,
            GameId = game.Id,
        };

        return privateGameDto;
    }
}
