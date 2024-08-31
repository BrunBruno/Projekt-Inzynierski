
using chess.Core.Abstraction;
using chess.Core.Entities;
using chess.Core.Enums;
using chess.Infrastructure.Contexts;
using Microsoft.EntityFrameworkCore;

namespace chess.Api.Tests.Game;

internal static partial class DbFilter {

    /// <summary>
    /// To create provided game timing
    /// </summary>
    /// <param name="dbContext"></param>
    /// <param name="timingType"></param>
    /// <returns> GameTiming id </returns>
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


    /// <summary>
    /// To create player
    /// </summary>
    /// <param name="dbContext"></param>
    /// <param name="userId"></param>
    /// <param name="username"></param>
    /// <returns> Player id </returns>
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


    /// <summary>
    /// To create game
    /// </summary>
    /// <param name="dbContext"></param>
    /// <param name="whitePlayerId"></param>
    /// <param name="blackPlayerId"></param>
    /// <param name="timingId"></param>
    /// <returns> Game id </returns>
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


    /// <summary>
    /// To set values of player to be included in game
    /// </summary>
    /// <param name="dbContext"></param>
    /// <param name="playerId"></param>
    /// <param name="gameId"></param>
    /// <param name="color"></param>
    /// <returns></returns>
    /// <exception cref="InvalidOperationException"></exception>
    internal static async Task AddPlayerToGame(this ChessAppDbContext dbContext, Guid playerId, Guid gameId, Colors color) {

        var player = await dbContext.Players.FirstOrDefaultAsync(p => p.Id == playerId)
            ?? throw new InvalidOperationException("Player not added.");

        player.GameId = gameId;
        player.IsPlaying = true;
        player.Color = color;

        dbContext.Players.Update(player);
        await dbContext.SaveChangesAsync();
    }


    /// <summary>
    /// To exclude player from game
    /// </summary>
    /// <param name="dbContext"></param>
    /// <param name="playerId"></param>
    /// <returns></returns>
    /// <exception cref="InvalidOperationException"></exception>
    internal static async Task ChangePlayerToNotPlaying(this ChessAppDbContext dbContext, Guid playerId) {

        var player = await dbContext.Players.FirstOrDefaultAsync(p => p.Id == playerId)
            ?? throw new InvalidOperationException("Player not added.");

        player.IsPlaying = false;
        player.Color = null;

        dbContext.Players.Update(player);
        await dbContext.SaveChangesAsync();
    }


    /// <summary>
    /// To set params of game to be active
    /// </summary>
    /// <param name="dbContext"></param>
    /// <param name="gameId"></param>
    /// <returns></returns>
    /// <exception cref="InvalidOperationException"></exception>
    internal static async Task StartGame(this ChessAppDbContext dbContext, Guid gameId) {

        var game = await dbContext.Games.FirstOrDefaultAsync(g => g.Id == gameId)
           ?? throw new InvalidOperationException("Game not added.");

        game.StartedAt = DateTime.UtcNow;
        game.WhitePlayer.TimeLeft = game.GameTiming.Seconds;
        game.BlackPlayer.TimeLeft = game.GameTiming.Seconds;

        dbContext.Games.Update(game);
        await dbContext.SaveChangesAsync();
    }


    /// <summary>
    /// To set params of game to be finished
    /// </summary>
    /// <param name="dbContext"></param>
    /// <param name="gameId"></param>
    /// <param name="winner"></param>
    /// <returns></returns>
    /// <exception cref="InvalidOperationException"></exception>
    internal static async Task EndGame(this ChessAppDbContext dbContext, Guid gameId, Colors winner) {

        var game = await dbContext.Games.FirstOrDefaultAsync(g => g.Id == gameId)
           ?? throw new InvalidOperationException("Game not added.");

        game.HasEnded = true;
        game.WinnerColor = winner;

        dbContext.Games.Update(game);
        await dbContext.SaveChangesAsync();
    }


    /// <summary>
    /// To add many games, player, timings and invitations
    /// </summary>
    /// <param name="dbContext"></param>
    /// <param name="isFinished"></param>
    /// <param name="withInvitation"></param>
    /// <returns></returns>
    internal static async Task AddGames(this ChessAppDbContext dbContext, bool isFinished, bool withInvitation) {

        var bulletTiming = new GameTiming()
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
        var invitations = new List<Invitation>();

        int userPlayerBulletElo = 1000;
        int enemyPlayerBulletElo = 1000;
        int userPlayerRapidElo = 1000;
        int enemyPlayerRapidElo = 1000;

        for (int i = 0; i < 100; i++) {

            var userPlayer = new Player() {
                Id = Guid.NewGuid(),
                Name = Constants.Username,
                Elo = i >= 50 ? userPlayerRapidElo : userPlayerBulletElo,
                Color = i % 2 == 0 ? Colors.White : Colors.Black,
                IsPlaying = true,
                FinishedGame = isFinished,
                UserId = Guid.Parse(Constants.UserId),
            };

            var enemyPlayer = new Player()
            {
                Id = Guid.NewGuid(),
                Name = "Enemy",
                Elo = i >= 50 ? enemyPlayerRapidElo : enemyPlayerBulletElo,
                Color = i % 2 == 0 ? Colors.Black : Colors.White,
                IsPlaying = true,
                FinishedGame = isFinished,
                UserId = Guid.NewGuid(),
            };

            var game = new Core.Entities.Game() {

                Id = Guid.NewGuid(),
                HasEnded = isFinished,
                CreatedAt = DateTime.UtcNow,

                WhitePlayerId = i % 2 == 0 ? userPlayer.Id : enemyPlayer.Id,
                WhitePlayer = i % 2 == 0 ? userPlayer : enemyPlayer,
                BlackPlayerId = i % 2 == 0 ? enemyPlayer.Id : userPlayer.Id,
                BlackPlayer = i % 2 == 0 ? enemyPlayer : userPlayer,

                TimingType = i >= 50 ? TimingTypes.Rapid : TimingTypes.Bullet,
                GameTimingId = i >= 50 ? rapidTiming.Id : bulletTiming.Id,

                EndGameType = i % 5 == 0 ? EndGameTypes.CheckMate : EndGameTypes.Resignation,
                WinnerColor = i % 4 == 0 ? Colors.White : Colors.Black,

                GameState = new GameState() { },

            };

            userPlayer.GameId = game.Id;
            enemyPlayer.GameId = game.Id;

            if (withInvitation) {
                invitations.Add(new Invitation() {
                    Id = Guid.NewGuid(),
                    InviterId = i % 2 == 0 ? userPlayer.UserId : enemyPlayer.UserId,
                    InviterName = i % 2 == 0 ? userPlayer.Name : enemyPlayer.Name,
                    InviteeId = i % 2 == 0 ? enemyPlayer.UserId : userPlayer.UserId,
                    InviteeName = i % 2 == 0 ? enemyPlayer.Name : userPlayer.Name,
                    GameId = game.Id,
                    Type = i >= 50 ? TimingTypes.Rapid : TimingTypes.Bullet,
                });
            }

            if(game.TimingType == TimingTypes.Bullet) {

                userPlayerBulletElo = userPlayer.Color == game.WinnerColor ? userPlayerBulletElo + 10 : userPlayerBulletElo - 10;
                enemyPlayerBulletElo = enemyPlayer.Color == game.WinnerColor ? enemyPlayerBulletElo + 10 : enemyPlayerBulletElo - 10;
            }

            if(game.TimingType == TimingTypes.Rapid) {

                userPlayerRapidElo = userPlayer.Color == game.WinnerColor ? userPlayerRapidElo + 10 : userPlayerRapidElo - 10;
                enemyPlayerRapidElo = enemyPlayer.Color == game.WinnerColor ? enemyPlayerRapidElo + 10 : enemyPlayerRapidElo - 10;
            }



            games.Add(game);
            players.Add(userPlayer);
            players.Add(enemyPlayer);
        }

        await dbContext.Invitations.AddRangeAsync(invitations);
        await dbContext.Players.AddRangeAsync(players);
        await dbContext.Games.AddRangeAsync(games);
        await dbContext.SaveChangesAsync();
    }

    internal static async Task AddMessagesToGame(this ChessAppDbContext dbContext, Guid gameId) {

        var game = await dbContext.Games
                .Include(g => g.WhitePlayer)
                .ThenInclude(p => p.Messages)
                .Include(g => g.BlackPlayer)
                .ThenInclude(p => p.Messages)
                .FirstOrDefaultAsync(g => g.Id == gameId)
            ?? throw new InvalidOperationException("Game not added.");


        for(int i = 0; i < 10; i++) {
            game.WhitePlayer.Messages.Add(new Message()
            {
                Content = "Message",
                PlayerId = game.WhitePlayerId,
            });
            game.BlackPlayer.Messages.Add(new Message()
            {
                Content = "Message",
                PlayerId = game.BlackPlayerId,
            });
        }

        dbContext.Games.Update(game);
        await dbContext.SaveChangesAsync();
    }
}
