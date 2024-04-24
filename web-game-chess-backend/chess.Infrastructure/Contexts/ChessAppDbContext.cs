
using chess.Core.Entities;
using chess.Infrastructure.Configuration;
using Microsoft.EntityFrameworkCore;

namespace chess.Infrastructure.Contexts;

public class ChessAppDbContext : DbContext {

    public DbSet<User> Users { get; set; }

    public DbSet<Role> Roles { get; set; }

    public DbSet<EmailVerificationCode> EmailVerificationCodes { get; set; }

    public DbSet<DataConfiguration> DataConfigurations { get; set; }

    public DbSet<BannedUser> BannedUsers { get; set; }

    public ChessAppDbContext(DbContextOptions<ChessAppDbContext> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder builder) {
        var configuration = new DbContextConfiguration();

        builder.ApplyConfiguration<User>(configuration);
        builder.ApplyConfiguration<Role>(configuration);
        builder.ApplyConfiguration<EmailVerificationCode>(configuration);
        builder.ApplyConfiguration<DataConfiguration>(configuration);
        builder.ApplyConfiguration<BannedUser>(configuration);
    }
}
