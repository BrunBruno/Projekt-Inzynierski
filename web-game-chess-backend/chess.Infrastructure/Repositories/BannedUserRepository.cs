
using chess.Application.Repositories;
using chess.Core.Entities;
using chess.Infrastructure.Contexts;

namespace chess.Infrastructure.Repositories;

public class BannedUserRepository : IBannedUserRepository {

    private readonly ChessAppDbContext _dbContext;

    public BannedUserRepository(ChessAppDbContext dbContext) {
        _dbContext = dbContext;
    }

    public async Task Create(BannedUser bannedUser) {
        await _dbContext.BannedUsers.AddAsync(bannedUser);
        await _dbContext.SaveChangesAsync();
    }
}
