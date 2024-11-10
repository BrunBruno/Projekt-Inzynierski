using chess.Application.Repositories.UserRepositories;
using chess.Core.Entities;
using chess.Infrastructure.Contexts;
using Microsoft.EntityFrameworkCore;

namespace chess.Infrastructure.Repositories.UserRepositories;

public class UserImageRepository : IUserImageRepository
{


    private readonly ChessAppDbContext _dbContext;

    public UserImageRepository(ChessAppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    ///<inheritdoc/>
    public async Task<UserImage?> GetByUserId(Guid userId)
        => await _dbContext.UserImages
            .FirstOrDefaultAsync(ui => ui.UserId == userId);

    ///<inheritdoc/>
    public async Task Create(UserImage userImage)
    {
        await _dbContext.UserImages.AddAsync(userImage);
        await _dbContext.SaveChangesAsync();
    }
}
