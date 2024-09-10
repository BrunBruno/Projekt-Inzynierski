
using chess.Application.Repositories;
using chess.Core.Entities;
using chess.Core.Enums;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.GameRequests.StartGames;

/// <summary>
/// Checks if provided timing exists
/// Gets all awaiting players (not playing and not private)
/// Matches players and creates games for each mach
/// </summary>
public class StartGamesRequestHandler : IRequestHandler<StartGamesRequest> {

    private readonly IGameRepository _gameRepository;
    private readonly IPlayerRepository _playerRepository;
    private readonly IGameStateRepository _gameStateRepository;
    private readonly IGameTimingRepository _gameTimingRepository;

    public StartGamesRequestHandler(
        IGameRepository gameRepository,
        IPlayerRepository playerRepository,
        IGameStateRepository gameStateRepository,
        IGameTimingRepository gameTimingRepository
    ) {
        _gameRepository = gameRepository;
        _playerRepository = playerRepository;
        _gameStateRepository = gameStateRepository;
        _gameTimingRepository = gameTimingRepository;
    }

    public async Task Handle(StartGamesRequest request, CancellationToken cancellationToken) {

        var timing = await _gameTimingRepository.GetById(request.TimingId) 
            ?? throw new NotFoundException("Timing not found.");

        var players = await _playerRepository.GetAllAvailablePlayersForTiming(request.TimingId);

        var matchedPlayers = new List<Player>();
        var random = new Random();
        var eloRange = GetRange(players.Count);

        foreach (var player in players) {
            if (matchedPlayers.Contains(player))
                continue;
         
            var possiblePlayers = players.Where(p => p.UserId != player.UserId && Math.Abs(p.Elo - player.Elo) <= eloRange).Except(matchedPlayers);
            var closestPlayer = possiblePlayers.OrderBy(pp => Math.Abs(pp.Elo - player.Elo)).FirstOrDefault();

            if (closestPlayer is not null) {

                matchedPlayers.Add(player);
                matchedPlayers.Add(closestPlayer);


                var game = new Game()
                {
                    Id = Guid.NewGuid(),
                    TimingType = timing.Type,
                    GameTimingId = request.TimingId,
                };

                player.IsPlaying = true;
                closestPlayer.IsPlaying = true;
                player.GameId = game.Id;
                closestPlayer.GameId = game.Id;


                var randomChoice = random.Next(2) == 0;
                game.WhitePlayerId = randomChoice ? player.Id : closestPlayer.Id;
                game.BlackPlayerId = randomChoice ? closestPlayer.Id : player.Id;

                player.Color = randomChoice ? Colors.White : Colors.Black;
                closestPlayer.Color = randomChoice ? Colors.Black : Colors.White;

                var gameState = new GameState()
                {
                    Id = Guid.NewGuid(),
                    GameId = game.Id,
                };


                await _playerRepository.Update(player);
                await _playerRepository.Update(closestPlayer);
                await _gameRepository.Create(game);
                await _gameStateRepository.Create(gameState);
            }
        }
    }

    private static int GetRange(int x) {
        return (int)Math.Pow(1.01, -(x - 500)) + 10;
    }
}
