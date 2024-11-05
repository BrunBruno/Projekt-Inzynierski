
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
    IEntityTypeConfiguration<UserVerificationCode>,
    IEntityTypeConfiguration<Core.Entities.DataConfiguration>,
    IEntityTypeConfiguration<UserBan>,
    IEntityTypeConfiguration<WebGame>,
    IEntityTypeConfiguration<GameTiming>,
    IEntityTypeConfiguration<WebGameState>,
    IEntityTypeConfiguration<WebGamePlayer>,
    IEntityTypeConfiguration<WebGameMove>,
    IEntityTypeConfiguration<Friendship>,
    IEntityTypeConfiguration<UserElo>,
    IEntityTypeConfiguration<WebGamePlayerMessage>,
    IEntityTypeConfiguration<WebGameMessage>,
    IEntityTypeConfiguration<UserStats>,
    IEntityTypeConfiguration<WebGameInvitation>,
    IEntityTypeConfiguration<UserImage>,
    IEntityTypeConfiguration<EngineGame>,
    IEntityTypeConfiguration<EngineGamePlayer>,
    IEntityTypeConfiguration<EngineGameMove>,
    IEntityTypeConfiguration<EngineGameState>,
    IEntityTypeConfiguration<EngineGameMessage>
{

    public void Configure(EntityTypeBuilder<User> builder) {
        builder
            .HasKey(u => u.Id);

        builder
            .HasOne(u => u.Role)
            .WithMany()
            .HasForeignKey(u => u.RoleId);
    }

    public void Configure(EntityTypeBuilder<Role> builder) {
        builder
            .HasKey(r => r.Id);

        builder
            .HasData(GetRoles());
    }

    public void Configure(EntityTypeBuilder<UserVerificationCode> builder) {
        builder
            .HasKey(evc => evc.Id);

        builder
            .HasOne(evc => evc.User)
            .WithOne()
            .HasForeignKey<UserVerificationCode>(evc => evc.UserId);
    }

    public void Configure(EntityTypeBuilder<Core.Entities.DataConfiguration> builder) {
        builder
            .HasKey(dc => dc.Id);

        builder
            .HasData(GetConfiguration());
    }

    public void Configure(EntityTypeBuilder<UserBan> builder) {
        builder
            .HasKey(bu => bu.Id);

        builder
            .HasOne(bu => bu.User)
            .WithOne()
            .HasForeignKey<UserBan>(bu => bu.UserId);
    }

    public void Configure(EntityTypeBuilder<WebGame> builder) {
        builder
            .HasKey(g => g.Id);

        builder
            .HasOne(g => g.WhitePlayer)
            .WithOne(p => p.WhiteGame)
            .HasForeignKey<WebGame>(g => g.WhitePlayerId);

        builder
            .HasOne(g => g.BlackPlayer)
            .WithOne(p => p.BlackGame)
            .HasForeignKey<WebGame>(g => g.BlackPlayerId);

        builder
            .HasOne(g => g.GameTiming)
            .WithMany(gt => gt.WebGames)
            .HasForeignKey(g => g.GameTimingId);
    }

    public void Configure(EntityTypeBuilder<GameTiming> builder) {
        builder
            .HasKey(gt => gt.Id);
    }

    public void Configure(EntityTypeBuilder<WebGameState> builder) {
        builder
            .HasKey(gs => gs.Id);

        builder
            .HasOne(gs => gs.Game)
            .WithOne(g => g.CurrentState)
            .HasForeignKey<WebGameState>(g => g.GameId);
    }

    public void Configure(EntityTypeBuilder<WebGamePlayer> builder) {
        builder
            .HasKey(p => p.Id);

        builder
            .HasOne(p => p.User)
            .WithMany(u => u.Players)
            .HasForeignKey(p => p.UserId);
    }

    public void Configure(EntityTypeBuilder<WebGameMove> builder) {
        builder
            .HasKey(m => m.Id);

        builder
            .HasOne(m => m.Game)
            .WithMany(g => g.Moves)
            .HasForeignKey(m => m.GameId);
    }

    public void Configure(EntityTypeBuilder<Friendship> builder) {
        builder
            .HasKey(f => f.Id);

        builder
            .HasOne(f => f.Requestor)
            .WithMany(u => u.RequestedFriendships)
            .HasForeignKey(f => f.RequestorId);

        builder
           .HasOne(f => f.Receiver)
           .WithMany(u => u.ReceivedFriendships)
           .HasForeignKey(f => f.ReceiverId);
    }

    public void Configure(EntityTypeBuilder<UserElo> builder) {
        builder
          .HasKey(e => e.Id);

        builder
            .HasOne(e => e.User)
            .WithOne(u => u.Elo)
            .HasForeignKey<UserElo>(e => e.UserId);
    }

    public void Configure(EntityTypeBuilder<WebGameMessage> builder) {
        builder
            .HasKey(m => m.Id);

        builder
            .HasOne(m => m.Game)
            .WithMany(p => p.Messages)
            .HasForeignKey(m => m.GameId);
    }

    public void Configure(EntityTypeBuilder<WebGamePlayerMessage> builder) {
        builder
            .HasKey(m => m.Id);

        builder
            .HasOne(m => m.Player)
            .WithMany(p => p.Messages)
            .HasForeignKey(m => m.PlayerId);
    }

    public void Configure(EntityTypeBuilder<UserStats> builder) {
        builder
            .HasKey(us => us.Id);

        builder
            .HasOne(us => us.User)
            .WithOne(u => u.Stats)
            .HasForeignKey<UserStats>(us => us.UserId);
    }

    public void Configure(EntityTypeBuilder<WebGameInvitation> builder) {
        builder
            .HasKey(i => i.Id);

        builder
            .HasOne(i => i.Game)
            .WithOne()
            .HasForeignKey<WebGameInvitation>(i => i.GameId);
    }

    public void Configure(EntityTypeBuilder<UserImage> builder) {
        builder
            .HasKey(ui => ui.Id);

        builder
            .HasOne(ui => ui.User)
            .WithOne(u => u.Image)
            .HasForeignKey<UserImage>(ui => ui.UserId);
    }

    public void Configure(EntityTypeBuilder<EngineGame> builder) {
        builder
            .HasKey(eg => eg.Id);

        builder
            .HasOne(eg => eg.Player)
            .WithOne(egp => egp.Game)
            .HasForeignKey<EngineGame>(eg => eg.PlayerId);
    }

    public void Configure(EntityTypeBuilder<EngineGamePlayer> builder) {
        builder
            .HasKey(egp => egp.Id);

        builder
            .HasOne(egp => egp.User)
            .WithMany(u => u.EngineGamePlayers)
            .HasForeignKey(p => p.UserId);
    }

    public void Configure(EntityTypeBuilder<EngineGameMove> builder) {
        builder
            .HasKey(egm => egm.Id);

        builder
            .HasOne(egm => egm.Game)
            .WithMany(eg => eg.Moves)
            .HasForeignKey(egm => egm.GameId);
    }

    public void Configure(EntityTypeBuilder<EngineGameState> builder) {
        builder
            .HasKey(egs => egs.Id);

        builder
            .HasOne(egs => egs.Game)
            .WithOne(eg => eg.CurrentState)
            .HasForeignKey<EngineGameState>(g => g.GameId);
    }

    public void Configure(EntityTypeBuilder<EngineGameMessage> builder) {
        builder
            .HasKey(egm => egm.Id);

        builder
            .HasOne(egm => egm.Game)
            .WithMany(eg => eg.Messages)
            .HasForeignKey(egm => egm.GameId);
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

    private static IEnumerable<Core.Entities.DataConfiguration> GetConfiguration() {
        var configurations = new List<Core.Entities.DataConfiguration>
        {
            new()
            {
                Id = (int)Core.Enums.DataConfiguration.UserPassword,
                MinLength = 5,
                MaxLength = null,
                RequireUppercase = false,
                RequireLowercase = false,
                RequireDigit = false,
                RequireSpecialChar = false,
            },
            new()
            {
                Id = (int)Core.Enums.DataConfiguration.UserName,
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
