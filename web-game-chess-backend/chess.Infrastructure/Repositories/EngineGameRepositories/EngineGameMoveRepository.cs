
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

    public async Task<List<EngineGameMove>> GetAllForGame(Guid gameId)
        => await _dbContext.EngineGameMoves
                    .Where(egm => egm.GameId == gameId)
                    .OrderBy(egm => egm.DoneAt)
                    .ToListAsync();

    public async Task Create(EngineGameMove move) {
        await _dbContext.EngineGameMoves.AddAsync(move);
        await _dbContext.SaveChangesAsync();
    }


}
