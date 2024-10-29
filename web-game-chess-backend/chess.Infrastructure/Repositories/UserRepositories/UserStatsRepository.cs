using chess.Application.Repositories.UserRepositories;
using chess.Core.Entities;
using chess.Infrastructure.Contexts;

namespace chess.Infrastructure.Repositories.UserRepositories;

public class UserStatsRepository : IUserStatsRepository
{

    private readonly ChessAppDbContext _dbContext;

    public UserStatsRepository(ChessAppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    ///<inheritdoc/>
    public async Task Update(UserStats userStats)
    {

        await _dbContext.SaveChangesAsync();
    }
}
