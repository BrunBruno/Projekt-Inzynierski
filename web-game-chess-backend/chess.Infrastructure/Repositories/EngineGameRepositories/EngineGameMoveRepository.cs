
using chess.Application.Repositories.EngineGameRepositories;
using chess.Core.Entities;
using chess.Infrastructure.Contexts;
using Microsoft.EntityFrameworkCore;

namespace chess.Infrastructure.Repositories.EngineGameRepositories;

public class EngineGameMoveRepository : IEngineGameMoveRepository {
    
    private readonly ChessAppDbContext _dbContext;

    public EngineGameMoveRepository(ChessAppDbContext dbContext) {
        _dbContext = dbContext;
    }

    ///<inheritdoc/>
    public async Task<List<EngineGameMove>> GetAllForGame(Guid gameId)
        => await _dbContext.EngineGameMoves
                    .Where(egm => egm.GameId == gameId)
                    .OrderByDescending(egm => egm.Turn)
                    .ToListAsync();

    ///<inheritdoc/>
    public async Task Create(EngineGameMove move) {
        await _dbContext.EngineGameMoves.AddAsync(move);
        await _dbContext.SaveChangesAsync();
    }

    ///<inheritdoc/>
    public async Task Delete(EngineGameMove move) {
        _dbContext.Remove(move);
        await _dbContext.SaveChangesAsync();
    }
}
