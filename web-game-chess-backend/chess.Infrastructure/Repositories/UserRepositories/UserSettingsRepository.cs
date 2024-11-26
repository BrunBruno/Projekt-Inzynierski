
using chess.Application.Repositories.UserRepositories;
using chess.Core.Entities;
using chess.Infrastructure.Contexts;
using Microsoft.EntityFrameworkCore;

namespace chess.Infrastructure.Repositories.UserRepositories;

public class UserSettingsRepository : IUserSettingsRepository {

    private readonly ChessAppDbContext _dbContext;

    public UserSettingsRepository(ChessAppDbContext dbContext) {
        _dbContext = dbContext;
    }

    ///<inheritdoc/>
    public async Task<UserSettings?> GetByUserId(Guid userId)
        => await _dbContext.UserSettings
                    .FirstOrDefaultAsync(us => us.UserId == userId);

    ///<inheritdoc/>
    public async Task Update(UserSettings userSettings) {
        _dbContext.UserSettings.Update(userSettings);
        await _dbContext.SaveChangesAsync();
    }
}
