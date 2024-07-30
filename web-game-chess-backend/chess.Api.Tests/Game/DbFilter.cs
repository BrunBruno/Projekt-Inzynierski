
using chess.Core.Entities;
using chess.Core.Enums;
using chess.Infrastructure.Contexts;
using Microsoft.EntityFrameworkCore;

namespace chess.Api.Tests.Game;

internal static partial class DbFilter {

    internal static async Task<Guid> CreateTiming(this ChessAppDbContext dbContext) {

        Guid timingId = Guid.NewGuid();

        var gameTiming = new GameTiming()
        {
            Id = timingId,
            Type = TimingTypes.Rapid,
            Seconds = 10 * 60,
            Increment = 0,
        };

        await dbContext.GameTimings.AddAsync(gameTiming);
        await dbContext.SaveChangesAsync();

        return timingId;
    }

    internal static async Task<Guid> AddPlayerForUser(this ChessAppDbContext dbContext) {

        Guid playerId = Guid.NewGuid();

        var player = new Player()
        {
            Id = playerId,
            Name = "TestUserName",
            UserId = Guid.Parse(Constants.UserId),
        };

        await dbContext.Players.AddAsync(player);
        await dbContext.SaveChangesAsync();

        return playerId;
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

    internal static async Task<Guid> AddGame(this ChessAppDbContext dbContext, Guid whitePlayerId, Guid blacjPlayerId, Guid timingId) {

        Guid gameId = Guid.NewGuid();

        var game = new Core.Entities.Game()
        {
            Id = gameId,
            WhitePlayerId = whitePlayerId,
            BlackPlayerId = blacjPlayerId,
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

    internal static async Task AddPlayerToGame(this ChessAppDbContext dbContext, Guid playerId, Guid gameId) {

        var player = await dbContext.Players.FirstOrDefaultAsync(p => p.Id == playerId)
            ?? throw new InvalidOperationException("Player not added.");

        player.GameId = gameId;

        dbContext.Players.Update(player);
        await dbContext.SaveChangesAsync();
    }

    internal static async Task UpdatePlayer(this ChessAppDbContext dbContext, Guid playerId) {

        var player = await dbContext.Players.FirstOrDefaultAsync(p => p.Id == playerId)
            ?? throw new InvalidOperationException("Player not added.");

        player.IsPlaying = true;
        player.Color = Colors.White;

        dbContext.Players.Update(player);
        await dbContext.SaveChangesAsync();
    }

    internal static async Task StartGame(this ChessAppDbContext dbContext, Guid gameId) {

        var game = await dbContext.Games.FirstOrDefaultAsync(g => g.Id == gameId)
           ?? throw new InvalidOperationException("Game not added.");

        game.StartedAt = DateTime.UtcNow;

        dbContext.Games.Update(game);
        await dbContext.SaveChangesAsync();
    }

    internal static async Task EndGame(this ChessAppDbContext dbContext, Guid gameId) {

        var game = await dbContext.Games.FirstOrDefaultAsync(g => g.Id == gameId)
           ?? throw new InvalidOperationException("Game not added.");

        game.HasEnded = true;
        game.WinnerColor = Colors.White;

        dbContext.Games.Update(game);
        await dbContext.SaveChangesAsync();
    }
}
