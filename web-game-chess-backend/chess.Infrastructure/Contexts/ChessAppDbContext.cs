
using chess.Core.Entities;
using chess.Infrastructure.Configuration;
using Microsoft.EntityFrameworkCore;

#pragma warning disable CS8618
namespace chess.Infrastructure.Contexts;

/// <summary>
/// DbContext
/// </summary>
public class ChessAppDbContext : DbContext {

    /// <summary>
    /// User related sets
    /// </summary>
    public DbSet<Role> Roles { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<UserProfileImage> UserProfileImages { get; set; }
    public DbSet<UserBackgroundImage> UserBackgroundImages { get; set; }
    public DbSet<UserElo> UserElos { get; set; }
    public DbSet<UserStats> UserStats { get; set; }
    public DbSet<UserSettings> UserSettings { get; set; }
    public DbSet<UserBan> UserBans { get; set; }
    public DbSet<UserVerificationCode> UserVerificationCodes { get; set; }

    /// <summary>
    /// Friendships related sets
    /// </summary>
    public DbSet<Friendship> Friendships { get; set; }
    public DbSet<FriendshipStats> FriendshipStats { get; set; }

    /// <summary>
    /// Web games related sets
    /// </summary>
    public DbSet<WebGame> WebGames { get; set; }
    public DbSet<WebGameTiming> GameTimings { get; set; }
    public DbSet<WebGameState> WebGameStates { get; set; }
    public DbSet<WebGameInvitation> WebGameInvitations { get; set; }
    public DbSet<WebGameMessage> WebGameMessages { get; set; }
    public DbSet<WebGamePlayer> WebGamePlayers { get; set; }
    public DbSet<WebGamePlayerMessage> WebGamePlayerMessages { get; set; }
    public DbSet<WebGameMove> WebGameMoves { get; set; }

    /// <summary>
    /// Engine games related sets
    /// </summary>
    public DbSet<EngineGame> EngineGames { get; set; }
    public DbSet<EngineGameState> EngineGameStates { get; set; }
    public DbSet<EngineGamePlayer> EngineGamePlayers { get; set; }
    public DbSet<EngineGameMove> EngineGameMoves { get; set; }
    public DbSet<EngineGameMessage> EngineGameMessages { get; set; }
    public DbSet<UserDataConfiguration> DataConfigurations { get; set; }


    public ChessAppDbContext(DbContextOptions<ChessAppDbContext> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder builder) {
        
        var configuration = new DbContextConfiguration();

        builder.ApplyConfiguration<User>(configuration);
        builder.ApplyConfiguration<Role>(configuration);
        builder.ApplyConfiguration<UserDataConfiguration>(configuration);
        builder.ApplyConfiguration<UserElo>(configuration);
        builder.ApplyConfiguration<UserStats>(configuration);
        builder.ApplyConfiguration<UserSettings>(configuration);
        builder.ApplyConfiguration<UserProfileImage>(configuration);
        builder.ApplyConfiguration<UserBackgroundImage>(configuration);
        builder.ApplyConfiguration<UserVerificationCode>(configuration);
        builder.ApplyConfiguration<UserBan>(configuration);

        builder.ApplyConfiguration<Friendship>(configuration);
        builder.ApplyConfiguration<FriendshipStats>(configuration);

        builder.ApplyConfiguration<WebGame>(configuration);
        builder.ApplyConfiguration<WebGameTiming>(configuration);
        builder.ApplyConfiguration<WebGameState>(configuration);
        builder.ApplyConfiguration<WebGameMessage>(configuration);
        builder.ApplyConfiguration<WebGameInvitation>(configuration);
        builder.ApplyConfiguration<WebGameMove>(configuration);
        builder.ApplyConfiguration<WebGamePlayer>(configuration);
        builder.ApplyConfiguration<WebGamePlayerMessage>(configuration);

        builder.ApplyConfiguration<EngineGame>(configuration);
        builder.ApplyConfiguration<EngineGameState>(configuration);
        builder.ApplyConfiguration<EngineGamePlayer>(configuration);
        builder.ApplyConfiguration<EngineGameMove>(configuration);
        builder.ApplyConfiguration<EngineGameMessage>(configuration);
    }
}
