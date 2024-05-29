
using chess.Application.Repositories;
using chess.Core.Entities;
using chess.Infrastructure.Contexts;

namespace chess.Infrastructure.Repositories;

public class UserStatsRepository : IUserStatsRepository {

    private readonly ChessAppDbContext _dbContext;

    public UserStatsRepository(ChessAppDbContext dbContext) {
        _dbContext = dbContext;
    }

    public async Task Update(UserStats userStats) {

        await _dbContext.SaveChangesAsync();
    }
}
