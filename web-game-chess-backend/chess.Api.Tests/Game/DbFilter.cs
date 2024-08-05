
using chess.Core.Abstraction;
using chess.Core.Entities;
using chess.Core.Enums;
using chess.Infrastructure.Contexts;
using Microsoft.EntityFrameworkCore;
using System.Drawing;

namespace chess.Api.Tests.Game;

internal static partial class DbFilter {

    internal static async Task<Guid> CreateTiming(this ChessAppDbContext dbContext, TimingType timingType) {

        Guid timingId = Guid.NewGuid();

        var gameTiming = new GameTiming()
        {
            Id = timingId,
            Type = timingType.Type,
            Seconds = timingType.Minutes * 60,
            Increment = timingType.Increment,
        };

        await dbContext.GameTimings.AddAsync(gameTiming);
        await dbContext.SaveChangesAsync();

        return timingId;
    }

    internal static async Task<Guid> AddPlayer(this ChessAppDbContext dbContext, Guid userId, string username) {

        Guid playerId = Guid.NewGuid();

        var player = new Player()
        {
            Id = playerId,
            Name = username,
            UserId = userId,
        };

        await dbContext.Players.AddAsync(player);
        await dbContext.SaveChangesAsync();

        return playerId;
    }

    internal static async Task<Guid> AddGame(this ChessAppDbContext dbContext, Guid whitePlayerId, Guid blackPlayerId, Guid timingId) {

        Guid gameId = Guid.NewGuid();

        var game = new Core.Entities.Game()
        {
            Id = gameId,
            WhitePlayerId = whitePlayerId,
            BlackPlayerId = blackPlayerId,
            GameTimingId = timingId,
        };

        var state = new GameState()
        {
            Id = Guid.NewGuid(),
            GameId = gameId,
        };

        await dbContext.Games.AddAsync(game);
        await dbContext.GameStates.AddAsync(state);
        await dbContext.SaveChangesAsync();

        return gameId;
    }

    internal static async Task AddPlayerToGame(this ChessAppDbContext dbContext, Guid playerId, Guid gameId, Colors color) {

        var player = await dbContext.Players.FirstOrDefaultAsync(p => p.Id == playerId)
            ?? throw new InvalidOperationException("Player not added.");

        player.GameId = gameId;
        player.IsPlaying = true;
        player.Color = color;

        dbContext.Players.Update(player);
        await dbContext.SaveChangesAsync();
    }

    internal static async Task ChangePlayerToNotPlaying(this ChessAppDbContext dbContext, Guid playerId) {


        var player = await dbContext.Players.FirstOrDefaultAsync(p => p.Id == playerId)
            ?? throw new InvalidOperationException("Player not added.");

        player.IsPlaying = false;
        player.Color = null;

        dbContext.Players.Update(player);
        await dbContext.SaveChangesAsync();
    }

    internal static async Task StartGame(this ChessAppDbContext dbContext, Guid gameId) {

        var game = await dbContext.Games.FirstOrDefaultAsync(g => g.Id == gameId)
           ?? throw new InvalidOperationException("Game not added.");

        game.StartedAt = DateTime.UtcNow;
        game.WhitePlayer.TimeLeft = game.GameTiming.Seconds;
        game.BlackPlayer.TimeLeft = game.GameTiming.Seconds;

        dbContext.Games.Update(game);
        await dbContext.SaveChangesAsync();
    }

    internal static async Task EndGame(this ChessAppDbContext dbContext, Guid gameId, Colors winner) {

        var game = await dbContext.Games.FirstOrDefaultAsync(g => g.Id == gameId)
           ?? throw new InvalidOperationException("Game not added.");

        game.HasEnded = true;
        game.WinnerColor = winner;

        dbContext.Games.Update(game);
        await dbContext.SaveChangesAsync();
    }

    internal static async Task AddFinishedGames(this ChessAppDbContext dbContext) {

        var blitzTiming = new GameTiming()
        {
            Id = Guid.NewGuid(),
            Type = TimingTypes.Bullet,
            Seconds = 60 * 2,
            Increment = 1,
        };

        var rapidTiming = new GameTiming()
        {
            Id = Guid.NewGuid(),
            Type = TimingTypes.Rapid,
            Seconds = 60 * 10,
            Increment = 0,
        };


        var games = new List<Core.Entities.Game>();
        var players = new List<Player>();

        for(int i = 0; i < 100; i++) {

            var userPlayer = new Player() { 
                Id = Guid.NewGuid(),
                Name = Constants.Username,
                Color = i % 2 == 0 ? Colors.White : Colors.Black,
                IsPlaying = true,
                FinishedGame = true,
                UserId = Guid.Parse(Constants.UserId),
            };
            var enemyPlayer = new Player()
            {
                Id = Guid.NewGuid(),
                Name = "Enemy",
                Color = i % 2 == 0 ? Colors.Black : Colors.White,
                IsPlaying = true,
                FinishedGame = true,
                UserId = Guid.NewGuid(),
            };

          var game = new Core.Entities.Game() {

                Id = Guid.NewGuid(),
                HasEnded = true,

                WhitePlayerId = i % 2 == 0 ? userPlayer.Id : enemyPlayer.Id,
                WhitePlayer = i % 2 == 0 ? userPlayer : enemyPlayer,
                BlackPlayerId = i % 2 == 0 ? enemyPlayer.Id : userPlayer.Id,
                BlackPlayer = i % 2 == 0 ? enemyPlayer : userPlayer,

                TimingType = i >= 50 ? TimingTypes.Rapid : TimingTypes.Blitz,
                GameTimingId = i >= 50 ? rapidTiming.Id : blitzTiming.Id,

                EndGameType = i % 5 == 0 ? EndGameTypes.CheckMate : EndGameTypes.Resignation,
                WinnerColor = i % 4 == 0 ? Colors.White : Colors.Black,

                GameState = new GameState() { },

            };

            userPlayer.GameId = game.Id;
            enemyPlayer.GameId = game.Id;

            games.Add(game);
            players.Add(userPlayer);
            players.Add(enemyPlayer);
        }

        await dbContext.Players.AddRangeAsync(players);
        await dbContext.Games.AddRangeAsync(games);
        await dbContext.SaveChangesAsync();
    }

    internal static async Task AddInvitations(this ChessAppDbContext dbContext) {

    }
}
