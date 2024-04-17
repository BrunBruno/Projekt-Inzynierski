
using chess.Core.Entities;
using chess.Core.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace chess.Infrastructure.Configuration;

public class DbContextConfiguration : 
    IEntityTypeConfiguration<User>,
    IEntityTypeConfiguration<Role>,
    IEntityTypeConfiguration<EmailVerificationCode>,
    IEntityTypeConfiguration<PasswordConfiguration>,
    IEntityTypeConfiguration<BannedUser>
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

    public void Configure(EntityTypeBuilder<PasswordConfiguration> builder) {
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

    private IEnumerable<Role> GetRoles() {

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

    private IEnumerable<PasswordConfiguration> GetConfiguration() {
        var configurations = new List<PasswordConfiguration>
        {
            new()
            {
                Id = (int)PasswordConfigurations.User,
                MinLength = 5,
                MaxLength = null,
                RequireUppercase = false,
                RequireLowercase = false,
                RequireDigit = true,
                RequireSpecialChar = false,
            }
        };

        return configurations;
    }
}
