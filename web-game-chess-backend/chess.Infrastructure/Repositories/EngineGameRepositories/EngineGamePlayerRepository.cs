
using chess.Application.Repositories.EngineGameRepositories;
using chess.Core.Entities;
using chess.Infrastructure.Contexts;

namespace chess.Infrastructure.Repositories.EngineGameRepositories;

public class EngineGamePlayerRepository : IEngineGamePlayerRepository {

    private readonly ChessAppDbContext _dbContext;

    public EngineGamePlayerRepository(ChessAppDbContext dbContext) {
        _dbContext = dbContext;
    }

    ///<inheritdoc/>
    public async Task Create(EngineGamePlayer player) {
        await _dbContext.EngineGamePlayers.AddAsync(player);
        await _dbContext.SaveChangesAsync();
    }
}
