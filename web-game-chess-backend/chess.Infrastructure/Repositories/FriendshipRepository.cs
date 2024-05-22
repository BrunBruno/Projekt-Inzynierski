
using chess.Application.Repositories;
using chess.Infrastructure.Contexts;

namespace chess.Infrastructure.Repositories;

public class FriendshipRepository : IFriendshipRepository {

    private readonly ChessAppDbContext _dbContext;

    public FriendshipRepository(ChessAppDbContext dbContext) {
        _dbContext = dbContext;
    }


}
