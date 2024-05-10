
using chess.Application.Repositories;
using chess.Core.Entities;
using chess.Core.Enums;
using MediatR;

namespace chess.Application.Requests.GameRequests.StartGames;

public class StartGamesRequestHandler : IRequestHandler<StartGamesRequest> {

    private readonly IGameRepository _gameRepository;
    private readonly IPlayerRepository _playerRepository;

    public StartGamesRequestHandler(
        IGameRepository gameRepository,
        IPlayerRepository playerRepository
    ) {
        _gameRepository = gameRepository;
        _playerRepository = playerRepository;
    }

    public async Task Handle(StartGamesRequest request, CancellationToken cancellationToken) {

        var players = await _playerRepository.GetAllAvailablePlayersForTiming(request.TimingId);

        var matchedPlayers = new List<Player>();
        var random = new Random();

        foreach (var player in players) {
            if (matchedPlayers.Contains(player))
                continue;

            var possiblePlayers = players.Where(p => p.UserId != player.UserId && Math.Abs(p.Elo - player.Elo) <= 200).Except(matchedPlayers); // 200 ??
            var closestPlayer = possiblePlayers.OrderBy(pp => Math.Abs(pp.Elo - player.Elo)).FirstOrDefault();

            if (closestPlayer is not null) {
                matchedPlayers.Add(player);
                matchedPlayers.Add(closestPlayer);

                var game = new Game()
                {
                    Id = Guid.NewGuid(),
                    CreatedAt = DateTime.UtcNow,
                    GameTimingId = request.TimingId
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

                await _gameRepository.Create(game);

            }
        }
    }
}
