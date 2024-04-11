
using chess.Core.Entities;
using chess.Infrastructure.Configuration;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;

namespace chess.Infrastructure.Contexts;

public class ChessAppDbContext : DbContext {

    /// <summary>
    /// DbSet for user entity.
    /// </summary>
    public DbSet<User> Users { get; set; }

    /// <summary>
    /// DbSet for role entity.
    /// </summary>
    public DbSet<Role> Roles { get; set; }

    /// <summary>
    /// Email verification codes
    /// </summary>
    public DbSet<EmailVerificationCode> EmailVerificationCodes { get; set; }

    public ChessAppDbContext(DbContextOptions<ChessAppDbContext> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder builder) {
        var configuration = new DbContextConfiguration();

        builder.ApplyConfiguration<User>(configuration);
        builder.ApplyConfiguration<Role>(configuration);
        builder.ApplyConfiguration<EmailVerificationCode>(configuration);

    }
}
