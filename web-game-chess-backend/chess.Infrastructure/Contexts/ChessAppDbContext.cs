﻿
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
