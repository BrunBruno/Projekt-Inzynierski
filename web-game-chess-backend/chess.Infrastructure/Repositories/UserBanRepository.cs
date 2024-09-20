
using chess.Application.Repositories;
using chess.Core.Entities;
using chess.Infrastructure.Contexts;

namespace chess.Infrastructure.Repositories;

public class UserBanRepository : IUserBanRepository {

    private readonly ChessAppDbContext _dbContext;

    public UserBanRepository(ChessAppDbContext dbContext) {
        _dbContext = dbContext;
    }

    ///<inheritdoc/>
    public async Task Create(UserBan bannedUser) {
        await _dbContext.BannedUsers.AddAsync(bannedUser);
        await _dbContext.SaveChangesAsync();
    }
}
