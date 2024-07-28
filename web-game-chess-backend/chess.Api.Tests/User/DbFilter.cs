
using chess.Core.Entities;
using chess.Core.Enums;
using chess.Infrastructure.Contexts;

namespace chess.Api.Tests.User;

public static partial class DbFilter {

    public static async Task Init(this ChessAppDbContext dbContext) {

        var roles = new List<Role>
            {
                new()
                {
                    Id = 1,
                    Name = "User"
                },
                new()
                {
                    Id = 2,
                    Name = "Admin"
                },
            };

        await dbContext.Roles.AddRangeAsync(roles);

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

        await dbContext.DataConfigurations.AddRangeAsync(configurations);

        await dbContext.SaveChangesAsync();
    }

    public static async Task AddUser(this ChessAppDbContext dbContext) {

        var user = new Core.Entities.User
        {
            Id = Guid.Parse(Constants.UserId),
            Email = "test@test.com",
            Username = "TestUserName",
            PasswordHash = Constants.PasswordHash,
        };

        await dbContext.Users.AddAsync(user);
        await dbContext.SaveChangesAsync();
    }

    public static async Task AddUserWithEmail(this ChessAppDbContext dbContext, string email) {
        var user = new Core.Entities.User
        {
            Id = Guid.NewGuid(),
            Email = email,
            Username = "TestUserName",
            PasswordHash = Constants.PasswordHash
        };

        await dbContext.Users.AddAsync(user);
        await dbContext.SaveChangesAsync();
    }

    public static async Task AddCodeForUser(this ChessAppDbContext dbContext) {
        var code = new EmailVerificationCode()
        {
            Id = Guid.NewGuid(),
            CodeHash = "AQAAAAIAAYagAAAAENYYAzvI42t/TYNc5wQ58JFqttNZkv8S0/pZGxT/cic1PPSMcbiOsM8xi2w5HwmfOg==", // "57375"
            UserId = Guid.Parse(Constants.UserId),
            ExpirationDate = DateTime.Now.AddYears(10)
        };

        await dbContext.EmailVerificationCodes.AddAsync(code);
        await dbContext.SaveChangesAsync();
    }

    public static async Task AddEloForUser(this ChessAppDbContext dbContext) {
        var elo = new Elo()
        {
            Id = Guid.NewGuid(),
            UserId = Guid.Parse(Constants.UserId),
        };

        await dbContext.Elos.AddAsync(elo);
        await dbContext.SaveChangesAsync();
    }
}
