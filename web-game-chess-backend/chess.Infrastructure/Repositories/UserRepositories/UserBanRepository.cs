
using chess.Application.Repositories.UserRepositories;
using chess.Core.Entities;
using chess.Infrastructure.Contexts;

namespace chess.Infrastructure.Repositories.UserRepositories;

public class UserBanRepository : IUserBanRepository {

    private readonly ChessAppDbContext _dbContext;

    public UserBanRepository(ChessAppDbContext dbContext) {
        _dbContext = dbContext;
    }

    ///<inheritdoc/>
    public async Task Create(UserBan bannedUser) {
        await _dbContext.UserBans.AddAsync(bannedUser);
        await _dbContext.SaveChangesAsync();
    }
}
