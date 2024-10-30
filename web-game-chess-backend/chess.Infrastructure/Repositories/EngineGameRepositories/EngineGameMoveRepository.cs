
using chess.Application.Repositories.EngineGameRepositories;
using chess.Core.Entities;
using chess.Infrastructure.Contexts;

namespace chess.Infrastructure.Repositories.EngineGameRepositories;

public class EngineGameMoveRepository : IEngineGameMoveRepository {

    
    private readonly ChessAppDbContext _dbContext;

    public EngineGameMoveRepository(ChessAppDbContext dbContext) {
        _dbContext = dbContext;
    }

    public async Task Create(EngineGameMove move) {
        await _dbContext.EngineGameMoves.AddAsync(move);
        await _dbContext.SaveChangesAsync();
    }
}
