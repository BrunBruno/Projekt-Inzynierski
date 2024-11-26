
using chess.Application.Repositories.FriendshipRepositories;
using chess.Infrastructure.Contexts;

namespace chess.Infrastructure.Repositories.FriendshipRepositories;

public class FriendshipStatsRepository : IFriendshipStatsRepository {


    private readonly ChessAppDbContext _dbContext;

    public FriendshipStatsRepository(ChessAppDbContext dbContext) {
        _dbContext = dbContext;
    }
}
