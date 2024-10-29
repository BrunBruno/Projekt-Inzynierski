
using chess.Application.Repositories.EngineGameRepositories;
using chess.Infrastructure.Contexts;

namespace chess.Infrastructure.Repositories.EngineGameRepositories;

public class EngineGameMoveRepository : IEngineGameMoveRepository {

    
    private readonly ChessAppDbContext _dbContext;

    public EngineGameMoveRepository(ChessAppDbContext dbContext) {
        _dbContext = dbContext;
    }
}
