﻿
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
    IEntityTypeConfiguration<Move>,
    IEntityTypeConfiguration<Friendship>,
    IEntityTypeConfiguration<Elo>,
    IEntityTypeConfiguration<Message>,
    IEntityTypeConfiguration<UserStats>,
    IEntityTypeConfiguration <Invitation>
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

    public void Configure(EntityTypeBuilder<EmailVerificationCode> builder) {
        builder
            .HasKey(evc => evc.Id);

        builder
            .HasOne(evc => evc.User)
            .WithOne()
            .HasForeignKey<EmailVerificationCode>(evc => evc.UserId);
    }

    public void Configure(EntityTypeBuilder<DataConfiguration> builder) {
        builder
            .HasKey(dc => dc.Id);

        builder
            .HasData(GetConfiguration());
    }

    public void Configure(EntityTypeBuilder<BannedUser> builder) {
        builder
            .HasKey(bu => bu.Id);

        builder
            .HasOne(bu => bu.User)
            .WithOne()
            .HasForeignKey<BannedUser>(bu => bu.UserId);
    }

    public void Configure(EntityTypeBuilder<Game> builder) {
        builder
            .HasKey(g => g.Id);

        builder
            .HasOne(g => g.WhitePlayer)
            .WithOne(p => p.WhiteGame)
            .HasForeignKey<Game>(g => g.WhitePlayerId);

        builder
            .HasOne(g => g.BlackPlayer)
            .WithOne(p => p.BlackGame)
            .HasForeignKey<Game>(g => g.BlackPlayerId);

        builder
            .HasOne(g => g.GameTiming)
            .WithMany(gt => gt.Games)
            .HasForeignKey(g => g.GameTimingId);
    }

    public void Configure(EntityTypeBuilder<GameTiming> builder) {
        builder
            .HasKey(gt => gt.Id);
    }

    public void Configure(EntityTypeBuilder<GameState> builder) {
        builder
            .HasKey(gs => gs.Id);

        builder
            .HasOne(gs => gs.Game)
            .WithOne(g => g.GameState)
            .HasForeignKey<GameState>(g => g.GameId);
    }

    public void Configure(EntityTypeBuilder<Player> builder) {
        builder
            .HasKey(p => p.Id);

        builder
            .HasOne(p => p.User)
            .WithMany(u => u.Players)
            .HasForeignKey(p => p.UserId);
    }

    public void Configure(EntityTypeBuilder<Move> builder) {
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

    public void Configure(EntityTypeBuilder<Elo> builder) {
        builder
          .HasKey(e => e.Id);

        builder
            .HasOne(e => e.User)
            .WithOne(u => u.Elo)
            .HasForeignKey<Elo>(e => e.UserId);
    }

    public void Configure(EntityTypeBuilder<Message> builder) {
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

    public void Configure(EntityTypeBuilder<Invitation> builder) {
        builder
            .HasKey(i => i.Id);

        builder
            .HasOne(i => i.Game)
            .WithOne()
            .HasForeignKey<Invitation>(i => i.GameId);
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
                RequireDigit = false,
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
