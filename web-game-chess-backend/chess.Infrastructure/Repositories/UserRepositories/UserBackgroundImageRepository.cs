
using chess.Application.Repositories.UserRepositories;
using chess.Core.Entities;
using chess.Infrastructure.Contexts;
using Microsoft.EntityFrameworkCore;

namespace chess.Infrastructure.Repositories.UserRepositories;

public class UserBackgroundImageRepository : IUserBackgroundImageRepository{

    private readonly ChessAppDbContext _dbContext;

    public UserBackgroundImageRepository(ChessAppDbContext dbContext) {
        _dbContext = dbContext;
    }

    ///<inheritdoc/>
    public async Task<UserBackgroundImage?> GetByUserId(Guid userId)
        => await _dbContext.UserBackgroundImages.FirstOrDefaultAsync(ui => ui.UserId == userId);

    ///<inheritdoc/>
    public async Task Create(UserBackgroundImage userImage) {
        await _dbContext.UserBackgroundImages.AddAsync(userImage);
        await _dbContext.SaveChangesAsync();
    }

    ///<inheritdoc/>
    public async Task Delete(UserBackgroundImage userImage) {
        _dbContext.UserBackgroundImages.Remove(userImage);
        await _dbContext.SaveChangesAsync();
    }
}
