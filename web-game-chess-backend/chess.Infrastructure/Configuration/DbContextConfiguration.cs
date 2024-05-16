
using chess.Core.Entities;
using chess.Core.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace chess.Infrastructure.Configuration;

/// <summary>
/// Configurations for DbContext.
/// </summary>
public class DbContextConfiguration : 
    IEntityTypeConfiguration<User>,
    IEntityTypeConfiguration<Role>,
    IEntityTypeConfiguration<EmailVerificationCode>,
    IEntityTypeConfiguration<DataConfiguration>,
    IEntityTypeConfiguration<BannedUser>,
    IEntityTypeConfiguration<Game>,
    IEntityTypeConfiguration<GameTiming>,
    IEntityTypeConfiguration<GameState>,
    IEntityTypeConfiguration<Player>,
    IEntityTypeConfiguration<Move>
{

    public void Configure(EntityTypeBuilder<User> builder) {
        builder
            .HasKey(x => x.Id);
        builder
            .HasOne(x => x.Role)
            .WithMany()
            .HasForeignKey(x => x.RoleId);
    }

    public void Configure(EntityTypeBuilder<Role> builder) {
        builder
            .HasKey(x => x.Id);
        builder
            .HasData(GetRoles());
    }

    public void Configure(EntityTypeBuilder<EmailVerificationCode> builder) {
        builder
            .HasKey(x => x.Id);
        builder
            .HasOne(x => x.User)
            .WithOne()
            .HasForeignKey<EmailVerificationCode>(x => x.UserId);
    }

    public void Configure(EntityTypeBuilder<DataConfiguration> builder) {
        builder
            .HasKey(x => x.Id);
        builder
            .HasData(GetConfiguration());
    }

    public void Configure(EntityTypeBuilder<BannedUser> builder) {
        builder
            .HasKey(x => x.Id);
        builder
            .HasOne(x => x.User)
            .WithOne()
            .HasForeignKey<BannedUser>(x => x.UserId);
    }

    public void Configure(EntityTypeBuilder<Game> builder) {
        builder
            .HasKey(x => x.Id);
        builder
            .HasOne(x => x.WhitePlayer)
            .WithOne(x => x.WhiteGame)
            .HasForeignKey<Game>(x => x.WhitePlayerId);
        builder
            .HasOne(x => x.BlackPlayer)
            .WithOne(x => x.BlackGame)
            .HasForeignKey<Game>(x => x.BlackPlayerId);
        builder
            .HasOne(x => x.GameTiming)
            .WithMany(x => x.Games)
            .HasForeignKey(x => x.GameTimingId);
        builder
            .HasOne(x => x.GameState)
            .WithOne()
            .HasForeignKey<Game>(x => x.GameStateId);
    }

    public void Configure(EntityTypeBuilder<GameTiming> builder) {
        builder
            .HasKey(x => x.Id);
    }

    public void Configure(EntityTypeBuilder<GameState> builder) {
        builder
            .HasKey(x => x.Id);
    }

    public void Configure(EntityTypeBuilder<Player> builder) {
        builder
            .HasKey(x => x.Id);
        builder
            .HasOne(x => x.User)
            .WithMany(x => x.Players)
            .HasForeignKey(x => x.UserId);
    }

    public void Configure(EntityTypeBuilder<Move> builder) {
        builder
            .HasKey(x => x.Id);
        builder
            .HasOne(x => x.Game)
            .WithMany(x => x.Moves)
            .HasForeignKey(x => x.GameId);
    }

    private static IEnumerable<Role> GetRoles() {

        var roles = new List<Role> 
        {
            new () 
            {
                Id = (int)Roles.User,
                Name = "User"

            },
            new () 
            {
                Id = (int)Roles.Admin,
                Name = "Admin"
            }
        };

        return roles;
    }

    private static IEnumerable<DataConfiguration> GetConfiguration() {
        var configurations = new List<DataConfiguration>
        {
            new()
            {
                Id = (int)DataConfigurations.UserPassword,
                MinLength = 5,
                MaxLength = null,
                RequireUppercase = false,
                RequireLowercase = false,
                RequireDigit = true,
                RequireSpecialChar = false,
            },
            new()
            {
                Id = (int)DataConfigurations.UserName,
                MinLength = 5,
                MaxLength = 30,
                RequireUppercase = false,
                RequireLowercase = false,
                RequireDigit = false,
                RequireSpecialChar = false,
            },
        };

        return configurations;
    }
}
