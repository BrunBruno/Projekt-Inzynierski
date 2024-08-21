
using chess.Application.Repositories;
using chess.Core.Entities;
using chess.Core.Enums;
using MediatR;

namespace chess.Application.Requests.GameRequests.CreateGameWithLink;

public class CreateGameWithLinkRequestHandler : IRequestHandler<CreateGameWithLinkRequest, CreateGameWithLinkDto>{

    private readonly IGameRepository _gameRepository;
    private readonly IGameTimingRepository _gameTimingRepository;
    private readonly IGameStateRepository _gameStateRepository;
    private readonly IPlayerRepository _playerRepository;

    public CreateGameWithLinkRequestHandler(
        IGameRepository gameRepository,
        IGameTimingRepository gameTimingRepository,
        IGameStateRepository gameStateRepository,
        IPlayerRepository playerRepository
    ) {
        _gameRepository = gameRepository;
        _gameTimingRepository = gameTimingRepository;
        _gameStateRepository = gameStateRepository;
        _playerRepository = playerRepository;
    }

    public async Task<CreateGameWithLinkDto> Handle(CreateGameWithLinkRequest request, CancellationToken cancellationToken) {


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

        var userPlayer = new Player()
        {
            Id = Guid.NewGuid(),
            Name = "",
            TimeLeft = request.Minutes * 60,
            TimingId = timing!.Id,
        };

        var friendPlayer = new Player()
        {
            Id = Guid.NewGuid(),
            Name = "",
            TimeLeft = request.Minutes * 60,
            TimingId = timing!.Id,
        };


        await _playerRepository.Create(userPlayer);
        await _playerRepository.Create(friendPlayer);


        var game = new Game()
        {
            Id = Guid.NewGuid(),
            IsPrivate = true,
            TimingType = timing!.Type,
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

        var gameState = new GameState()
        {
            Id = Guid.NewGuid(),
            GameId = game.Id,
        };


        await _gameRepository.Create(game);
        await _gameStateRepository.Create(gameState);


        var privateGameDto = new CreateGameWithLinkDto()
        {
            GameId = game.Id,
            GameUrl = $"{game.Id}"
        };


        return privateGameDto;
    }
}
