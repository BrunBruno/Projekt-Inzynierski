
using chess.Core.Entities;
using chess.Core.Enums;
using chess.Infrastructure.Contexts;
using Microsoft.EntityFrameworkCore;

namespace chess.Api.Tests.EngineGame;

internal static partial class DbFilter {

    /// <summary>
    /// Adds game for main constant user
    /// </summary>
    /// <param name="dbContext"></param>
    /// <returns></returns>
    internal static async Task<Guid> AddEngineGameForUser(this ChessAppDbContext dbContext) {

        var gameId = Guid.NewGuid();

        var game = new Core.Entities.EngineGame()
        {
            Id = gameId,
            EngineLevel = 1,
            Player = new EngineGamePlayer()
            {
                Color = PieceColor.White,
                Name = Constants.Username,
                UserId = Guid.Parse(Constants.UserId),
            },
            CurrentState = new EngineGameState(),
            Moves = new List<EngineGameMove>(),
        };

        dbContext.EngineGames.Add(game);
        await dbContext.SaveChangesAsync();

        return gameId;
    }

    /// <summary>
    /// Add game for other created users
    /// </summary>
    /// <param name="dbContext"></param>
    /// <param name="userId"></param>
    /// <returns></returns>
    internal static async Task<Guid> AddEngineGame(this ChessAppDbContext dbContext, Guid userId) {

        var gameId = Guid.NewGuid();

        var game = new Core.Entities.EngineGame()
        {
            Id = gameId,
            EngineLevel = 1,
            Player = new EngineGamePlayer()
            {
                Color = PieceColor.White,
                Name = "Username",
                UserId = userId,
            },
            CurrentState = new EngineGameState(),
            Moves = new List<EngineGameMove>(),
        };

        dbContext.EngineGames.Add(game);
        await dbContext.SaveChangesAsync();

        return gameId;
    }

    /// <summary>
    /// Updates game to finished state
    /// </summary>
    /// <param name="dbContext"></param>
    /// <param name="gameId"></param>
    /// <param name="winnerColor"></param>
    /// <returns></returns>
    internal static async Task EndEngineGame(this ChessAppDbContext dbContext, Guid gameId, PieceColor winnerColor) {

        var game = await dbContext.EngineGames.FirstAsync(eg => eg.Id == gameId);

        game.HasEnded = true;
        game.WinnerColor = winnerColor;
        game.EloGain = 10;

        dbContext.EngineGames.Update(game); 
        await dbContext.SaveChangesAsync();
    }

    /// <summary>
    /// Adds many finished engine games for constant user
    /// </summary>
    /// <param name="dbContext"></param>
    /// <returns></returns>
    internal static async Task AddManyEngineGamesForUser(this ChessAppDbContext dbContext) {

        var games = new List<Core.Entities.EngineGame>();

        for (int i = 0; i < 10; i++) {
            games.Add(new Core.Entities.EngineGame()
            {
                Id = Guid.NewGuid(),
                HasEnded = true,
                WinnerColor = i % 2 == 0 ? PieceColor.White : PieceColor.Black,

                Player = new EngineGamePlayer() { 
                    Color = PieceColor.White,
                    Name = Constants.Username,
                    UserId = Guid.Parse(Constants.UserId),
                },
                CurrentState = new EngineGameState(),
            });
        }

        await dbContext.EngineGames.AddRangeAsync(games);
        await dbContext.SaveChangesAsync();
    }

    /// <summary>
    /// Adds messages to engine game
    /// </summary>
    /// <param name="dbContext"></param>
    /// <param name="gameId"></param>
    /// <returns></returns>
    internal static async Task AddMessagesToEngineGame(this ChessAppDbContext dbContext, Guid gameId) {

        var messages = new List<EngineGameMessage>();

        for (int i = 0; i < 5; i++) {
            messages.Add(new EngineGameMessage() { 
                Id = Guid.NewGuid(),
                Content = "message",
                GameId = gameId,
            });
        }

        await dbContext.EngineGameMessages.AddRangeAsync(messages);
        await dbContext.SaveChangesAsync();
    }

    /// <summary>
    /// Adds moves to engine game
    /// </summary>
    /// <param name="dbContext"></param>
    /// <param name="gameId"></param>
    /// <returns></returns>
    internal static async Task AddMovesToEngineGame(this ChessAppDbContext dbContext, Guid gameId) {

        var moves = new List<EngineGameMove>();

        for (int i = 0; i < 5; i++) {
            moves.Add(new EngineGameMove()
            {
                Id = Guid.NewGuid(),
                Position = "",
                DoneMove = "",
                FenMove = "",
                OldCoordinates = "",
                NewCoordinates = "",
                GameId = gameId,
            });
        }

        await dbContext.EngineGameMoves.AddRangeAsync(moves);
        await dbContext.SaveChangesAsync();
    }

    /// <summary>
    /// Adds game with empty position for engine not working correctly
    /// </summary>
    /// <param name="dbContext"></param>
    /// <returns></returns>
    internal static async Task<Guid> AddEngineGameWithWrongPosition(this ChessAppDbContext dbContext) {

        var gameId = Guid.NewGuid();

        var game = new Core.Entities.EngineGame()
        {
            Id = gameId,
            EngineLevel = 1,
            Position = "",
            Player = new EngineGamePlayer()
            {
                Color = PieceColor.White,
                Name = Constants.Username,
                UserId = Guid.Parse(Constants.UserId),
            },
            CurrentState = new EngineGameState(),
            Moves = new List<EngineGameMove>(),
        };

        dbContext.EngineGames.Add(game);
        await dbContext.SaveChangesAsync();

        return gameId;
    }
}
