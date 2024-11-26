
using chess.Application.Repositories.UserRepositories;
using chess.Core.Entities;
using chess.Infrastructure.Contexts;

namespace chess.Infrastructure.Repositories.UserRepositories;

public class UserEloRepository : IUserEloRepository {

    private readonly ChessAppDbContext _dbContext;

    public UserEloRepository(ChessAppDbContext dbContext) {
        _dbContext = dbContext;
    }

    ///<inheritdoc/>
    public async Task Update(UserElo elo) {
        _dbContext.UserElos.Update(elo);
        await _dbContext.SaveChangesAsync();
    }
}
