
using chess.Application.Repositories.EngineGameRepositories;
using chess.Core.Entities;
using chess.Infrastructure.Contexts;
using Microsoft.EntityFrameworkCore;

namespace chess.Infrastructure.Repositories.EngineGameRepositories;

public class EngineGameMessageRepository : IEngineGameMessageRepository {

    private readonly ChessAppDbContext _dbContext;

    public EngineGameMessageRepository(ChessAppDbContext dbContext) {
        _dbContext = dbContext;
    }

    ///<inheritdoc/>
    public async Task<List<EngineGameMessage>> GetAllForGame(Guid gameId)
        => await _dbContext.EngineGameMessages
                    .Where(egm => egm.GameId == gameId)
                    .OrderBy(egm => egm.SentAt)
                    .ToListAsync();
                    
    ///<inheritdoc/>
    public async Task Create(EngineGameMessage message) {
        await _dbContext.EngineGameMessages.AddAsync(message);
        await _dbContext.SaveChangesAsync();
    }
}
