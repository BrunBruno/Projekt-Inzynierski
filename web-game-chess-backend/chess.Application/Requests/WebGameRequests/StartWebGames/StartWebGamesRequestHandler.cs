using chess.Application.Repositories.WebGameRepositories;
using chess.Core.Entities;
using chess.Core.Enums;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.WebGameRequests.StartWebGames;

/// <summary>
/// Checks if provided timing exists
/// Gets all awaiting players (not playing and not private)
/// Matches players and creates games for each mach
/// </summary>
public class StartWebGamesRequestHandler : IRequestHandler<StartWebGamesRequest> {

    private readonly Random _random = new();
    private readonly IWebGameRepository _webGameRepository;
    private readonly IWebGamePlayerRepository _webGamePlayerRepository;
    private readonly IWebGameStateRepository _gameStateRepository;
    private readonly IWebGameTimingRepository _webGameTimingRepository;

    public StartWebGamesRequestHandler(
        IWebGameRepository gameRepository,
        IWebGamePlayerRepository playerRepository,
        IWebGameStateRepository gameStateRepository,
        IWebGameTimingRepository gameTimingRepository
    ) {
        _webGameRepository = gameRepository;
        _webGamePlayerRepository = playerRepository;
        _gameStateRepository = gameStateRepository;
        _webGameTimingRepository = gameTimingRepository;
    }

    public async Task Handle(StartWebGamesRequest request, CancellationToken cancellationToken) {

        var timing = await _webGameTimingRepository.GetById(request.TimingId) 
            ?? throw new NotFoundException("Timing not found.");

        var players = await _webGamePlayerRepository.GetAllAvailablePlayersForTiming(request.TimingId);

        var matchedPlayers = new List<WebGamePlayer>();
        var eloRange = GetRange(players.Count);

        foreach (var player in players) {
            if (matchedPlayers.Contains(player))
                continue;
         
            var possiblePlayers = players.Where(p => p.UserId != player.UserId && Math.Abs(p.Elo - player.Elo) <= eloRange).Except(matchedPlayers);
            var closestPlayer = possiblePlayers.OrderBy(pp => Math.Abs(pp.Elo - player.Elo)).FirstOrDefault();

            if (closestPlayer is not null) {

                matchedPlayers.Add(player);
                matchedPlayers.Add(closestPlayer);


                var game = new WebGame()
                {
                    Id = Guid.NewGuid(),
                    TimingType = timing.Type,
                    GameTimingId = request.TimingId,
                };

                player.IsPlaying = true;
                closestPlayer.IsPlaying = true;
                player.GameId = game.Id;
                closestPlayer.GameId = game.Id;


                var randomChoice = _random.Next(2) == 0;
                game.WhitePlayerId = randomChoice ? player.Id : closestPlayer.Id;
                game.BlackPlayerId = randomChoice ? closestPlayer.Id : player.Id;

                player.Color = randomChoice ? PieceColor.White : PieceColor.Black;
                closestPlayer.Color = randomChoice ? PieceColor.Black : PieceColor.White;

                var gameState = new WebGameState()
                {
                    Id = Guid.NewGuid(),
                    GameId = game.Id,
                };


                await _webGamePlayerRepository.Update(player);
                await _webGamePlayerRepository.Update(closestPlayer);
                await _webGameRepository.Create(game);
                await _gameStateRepository.Create(gameState);
            }
        }
    }

    private static int GetRange(int x) {
        return (int)Math.Pow(1.01, -(x - 1000)) + 10;
    }
}
