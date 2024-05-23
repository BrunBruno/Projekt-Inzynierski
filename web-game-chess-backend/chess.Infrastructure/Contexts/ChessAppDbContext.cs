
using chess.Core.Entities;
using chess.Infrastructure.Configuration;
using Microsoft.EntityFrameworkCore;

namespace chess.Infrastructure.Contexts;

/// <summary>
/// DbContext
/// </summary>
public class ChessAppDbContext : DbContext {

    /// <summary>
    /// User dbset
    /// </summary>
    public DbSet<User> Users { get; set; }

    /// <summary>
    /// Roles dbset
    /// </summary>
    public DbSet<Role> Roles { get; set; }

    /// <summary>
    /// EmailVerificationCode dbset
    /// </summary>
    public DbSet<EmailVerificationCode> EmailVerificationCodes { get; set; }

    /// <summary>
    /// DataConfiguration dbset
    /// </summary>
    public DbSet<DataConfiguration> DataConfigurations { get; set; }

    /// <summary>
    /// BannedUser dbset
    /// </summary>
    public DbSet<BannedUser> BannedUsers { get; set; }

    /// <summary>
    /// Games dbset
    /// </summary>
    public DbSet<Game> Games { get; set; }

    /// <summary>
    /// Game timing dbset
    /// </summary>
    public DbSet<GameTiming> GameTimings { get; set; }

    /// <summary>
    /// Game states  dbset
    /// </summary>
    public DbSet<GameState> GameStates { get; set; }

    /// <summary>
    /// plaers dbset
    /// </summary>
    public DbSet<Player> Players { get; set; }

    /// <summary>
    /// moves dbset
    /// </summary>
    public DbSet<Move> Moves { get; set; }

    /// <summary>
    /// Friendships dbset
    /// </summary>
    public DbSet<Friendship> Friendships { get; set; }



    public ChessAppDbContext(DbContextOptions<ChessAppDbContext> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder builder) {
        var configuration = new DbContextConfiguration();

        builder.ApplyConfiguration<User>(configuration);
        builder.ApplyConfiguration<Role>(configuration);
        builder.ApplyConfiguration<EmailVerificationCode>(configuration);
        builder.ApplyConfiguration<DataConfiguration>(configuration);
        builder.ApplyConfiguration<BannedUser>(configuration);
        builder.ApplyConfiguration<Game>(configuration);
        builder.ApplyConfiguration<GameTiming>(configuration);
        builder.ApplyConfiguration<GameState>(configuration);
        builder.ApplyConfiguration<Player>(configuration);
        builder.ApplyConfiguration<Move>(configuration);
        builder.ApplyConfiguration<Friendship>(configuration);
    }
}
