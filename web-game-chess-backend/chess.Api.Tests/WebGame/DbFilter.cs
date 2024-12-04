
using chess.Core.Entities;
using chess.Core.Enums;
using chess.Core.Models;
using chess.Infrastructure.Contexts;
using Microsoft.EntityFrameworkCore;

namespace chess.Api.Tests.WebGame;

internal static partial class DbFilter {

    /// <summary>
    /// To create provided game timing
    /// </summary>
    /// <param name="dbContext"></param>
    /// <param name="timingType"></param>
    /// <returns> GameTiming id </returns>
    internal static async Task<Guid> CreateTiming(this ChessAppDbContext dbContext, TimingTypeModel timingType) {

        Guid timingId = Guid.NewGuid();

        var gameTiming = new WebGameTiming()
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

        var player = new WebGamePlayer()
        {
            Id = playerId,
            Name = username,
            UserId = userId,
        };

        await dbContext.WebGamePlayers.AddAsync(player);
        await dbContext.SaveChangesAsync();

        return playerId;
    }

    internal static async Task<Guid> AddGameWithTempPlayer(this ChessAppDbContext dbContext, Guid playerId, Guid timingId) {

        Guid gameId = Guid.NewGuid();

        var tempPlayer = new WebGamePlayer()
        {
            Id = Guid.NewGuid(),
            Name = "",
            IsTemp = true,
            UserId = Guid.Parse(Constants.UserId),
        };

        var game = new Core.Entities.WebGame()
        {
            Id = gameId,
            WhitePlayerId = playerId,
            BlackPlayerId = tempPlayer.Id,
            GameTimingId = timingId,
            IsPrivate = true,
        };

        var state = new WebGameState()
        {
            Id = Guid.NewGuid(),
            GameId = gameId,
        };

        await dbContext.WebGamePlayers.AddAsync(tempPlayer);
        await dbContext.WebGames.AddAsync(game);
        await dbContext.WebGameStates.AddAsync(state);
        await dbContext.SaveChangesAsync();

        return gameId;
    }


    /// <summary>
    /// To create game
    /// </summary>
    /// <param name="dbContext"></param>
    /// <param name="whitePlayerId"></param>
    /// <param name="blackPlayerId"></param>
    /// <param name="timingId"></param>
    /// <returns> Game id </returns>
    internal static async Task<Guid> AddGame(this ChessAppDbContext dbContext, Guid whitePlayerId, Guid blackPlayerId, Guid timingId, bool isPrivate) {

        Guid gameId = Guid.NewGuid();

        var game = new Core.Entities.WebGame()
        {
            Id = gameId,
            WhitePlayerId = whitePlayerId,
            BlackPlayerId = blackPlayerId,
            GameTimingId = timingId,
            IsPrivate = isPrivate,
        };

        var state = new WebGameState()
        {
            Id = Guid.NewGuid(),
            GameId = gameId,
        };

        await dbContext.WebGames.AddAsync(game);
        await dbContext.WebGameStates.AddAsync(state);
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
    internal static async Task AddPlayerToGame(this ChessAppDbContext dbContext, Guid playerId, Guid gameId, PieceColor color) {

        var game = await dbContext.WebGames.FirstOrDefaultAsync(g => g.Id == gameId)
            ?? throw new InvalidOperationException("Game not added.");

        var player = await dbContext.WebGamePlayers.FirstOrDefaultAsync(p => p.Id == playerId)
            ?? throw new InvalidOperationException("Player not added.");

        player.GameId = gameId;
        player.IsPlaying = true;
        player.Color = color;


        dbContext.WebGames.Update(game);
        dbContext.WebGamePlayers.Update(player);
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

        var player = await dbContext.WebGamePlayers.FirstOrDefaultAsync(p => p.Id == playerId)
            ?? throw new InvalidOperationException("Player not added.");

        player.IsPlaying = false;
        player.Color = null;

        dbContext.WebGamePlayers.Update(player);
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

        var game = await dbContext.WebGames.FirstOrDefaultAsync(g => g.Id == gameId)
           ?? throw new InvalidOperationException("Game not added.");

        game.StartedAt = DateTime.UtcNow;
        game.WhitePlayer.TimeLeft = game.GameTiming.Seconds;
        game.BlackPlayer.TimeLeft = game.GameTiming.Seconds;

        dbContext.WebGames.Update(game);
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
    internal static async Task EndGame(this ChessAppDbContext dbContext, Guid gameId, PieceColor winner) {

        var game = await dbContext.WebGames.FirstOrDefaultAsync(g => g.Id == gameId)
           ?? throw new InvalidOperationException("Game not added.");

        game.HasEnded = true;
        game.WinnerColor = winner;

        dbContext.WebGames.Update(game);
        await dbContext.SaveChangesAsync();
    }


    /// <summary>
    /// To add many games, player, timings and invitations
    /// </summary>
    /// <param name="dbContext"></param>
    /// <param name="isFinished"></param>
    /// <param name="withInvitation"></param>
    /// <returns></returns>
    internal static async Task AddGames(this ChessAppDbContext dbContext, bool isFinished, bool withInvitation, Guid? friendshipId=null) {

        var bulletTiming = new WebGameTiming()
        {
            Id = Guid.NewGuid(),
            Type = TimingTypes.Bullet,
            Seconds = 60 * 2,
            Increment = 1,
        };

        var rapidTiming = new WebGameTiming()
        {
            Id = Guid.NewGuid(),
            Type = TimingTypes.Rapid,
            Seconds = 60 * 10,
            Increment = 0,
        };

        var user = new Core.Entities.User()
        {
            Id = Guid.Parse(Constants.UserId),
            Email = Constants.Email,
            Username = Constants.Username,
            PasswordHash = Constants.PasswordHash,
        };

        var enemy = new Core.Entities.User()
        {
            Id = friendshipId != null ? (Guid)friendshipId : Guid.NewGuid(),
            Email = "enemy@test.com",
            Username = "Enemy",
            PasswordHash = Constants.PasswordHash,
        };

        var WebGames = new List<Core.Entities.WebGame>();
        var players = new List<WebGamePlayer>();
        var invitations = new List<WebGameInvitation>();

        int userPlayerBulletElo = 1000;
        int enemyPlayerBulletElo = 1000;
        int userPlayerRapidElo = 1000;
        int enemyPlayerRapidElo = 1000;

        for (int i = 0; i < 100; i++) {



            var userPlayer = new WebGamePlayer() {
                Id = Guid.NewGuid(),
                Name = Constants.Username,
                Elo = i >= 50 ? userPlayerRapidElo : userPlayerBulletElo,
                Color = i % 2 == 0 ? PieceColor.White : PieceColor.Black,
                IsPlaying = true,
                FinishedGame = isFinished,
                UserId = Guid.Parse(Constants.UserId),
                User = user,
                TimeLeft = isFinished == true ? 0 : 24 * 60 * 60,
            };

            var enemyPlayer = new WebGamePlayer()
            {
                Id = Guid.NewGuid(),
                Name = "Enemy",
                Elo = i >= 50 ? enemyPlayerRapidElo : enemyPlayerBulletElo,
                Color = i % 2 == 0 ? PieceColor.Black : PieceColor.White,
                IsPlaying = true,
                FinishedGame = isFinished,
                UserId = enemy.Id,
                User = enemy,
                TimeLeft = isFinished == true ? 0 : 24 * 60 * 60,
            };

            var game = new Core.Entities.WebGame() {

                Id = Guid.NewGuid(),
                HasEnded = isFinished,
                IsPrivate = friendshipId != null,
                CreatedAt = DateTime.UtcNow.AddMinutes(-30),
                StartedAt = DateTime.UtcNow.AddMinutes(-20),
                EndedAt = isFinished == true ? DateTime.UtcNow : null,

                WhitePlayerId = i % 2 == 0 ? userPlayer.Id : enemyPlayer.Id,
                WhitePlayer = i % 2 == 0 ? userPlayer : enemyPlayer,
                BlackPlayerId = i % 2 == 0 ? enemyPlayer.Id : userPlayer.Id,
                BlackPlayer = i % 2 == 0 ? enemyPlayer : userPlayer,

                TimingType = i >= 50 ? TimingTypes.Rapid : TimingTypes.Bullet,
                GameTimingId = i >= 50 ? rapidTiming.Id : bulletTiming.Id,

                EndGameType = i % 5 == 0 ? GameEndReason.CheckMate : GameEndReason.Resignation,
                WinnerColor = i % 4 == 0 ? PieceColor.White : PieceColor.Black,

                CurrentState = new WebGameState() { },

            };

            userPlayer.GameId = game.Id;
            enemyPlayer.GameId = game.Id;

            if (withInvitation) {
                invitations.Add(new WebGameInvitation() {
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


            WebGames.Add(game);
            players.Add(userPlayer);
            players.Add(enemyPlayer);
        }

        await dbContext.Users.AddAsync(user);
        await dbContext.Users.AddAsync(enemy);
        await dbContext.WebGameInvitations.AddRangeAsync(invitations);
        await dbContext.WebGamePlayers.AddRangeAsync(players);
        await dbContext.WebGames.AddRangeAsync(WebGames);
        await dbContext.SaveChangesAsync();
    }

    /// <summary>
    /// To add many messages for game with provided id
    /// </summary>
    /// <param name="dbContext"></param>
    /// <param name="gameId"></param>
    /// <returns></returns>
    /// <exception cref="InvalidOperationException"></exception>
    internal static async Task AddPlayerMessagesToGame(this ChessAppDbContext dbContext, Guid gameId) {

        var game = await dbContext.WebGames
                .Include(g => g.WhitePlayer)
                .ThenInclude(p => p.Messages)
                .Include(g => g.BlackPlayer)
                .ThenInclude(p => p.Messages)
                .FirstOrDefaultAsync(g => g.Id == gameId)
            ?? throw new InvalidOperationException("Game not added.");


        for(int i = 0; i < 10; i++) {
            game.WhitePlayer.Messages.Add(new WebGamePlayerMessage()
            {
                Content = "Message",
                PlayerId = game.WhitePlayerId,
            });
            game.BlackPlayer.Messages.Add(new WebGamePlayerMessage()
            {
                Content = "Message",
                PlayerId = game.BlackPlayerId,
            });
        }

        dbContext.WebGames.Update(game);
        await dbContext.SaveChangesAsync();
    }
}
