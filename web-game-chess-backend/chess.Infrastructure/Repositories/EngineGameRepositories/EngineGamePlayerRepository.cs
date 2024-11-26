
using chess.Application.Repositories.EngineGameRepositories;
using chess.Core.Entities;
using chess.Infrastructure.Contexts;
using Microsoft.EntityFrameworkCore;

namespace chess.Infrastructure.Repositories.EngineGameRepositories;

public class EngineGamePlayerRepository : IEngineGamePlayerRepository {

    private readonly ChessAppDbContext _dbContext;

    public EngineGamePlayerRepository(ChessAppDbContext dbContext) {
        _dbContext = dbContext;
    }

    ///<inheritdoc/>
    public async Task<List<EngineGamePlayer>> GetAllForUser(Guid userId)
        => await _dbContext.EngineGamePlayers
                            .Include(p => p.User)
                            .Include(p => p.Game)
                            .Where(p => p.UserId == userId)
                            .OrderByDescending(p => p.CreatedAt)
                            .ToListAsync();

    ///<inheritdoc/>
    public async Task Create(EngineGamePlayer player) {
        await _dbContext.EngineGamePlayers.AddAsync(player);
        await _dbContext.SaveChangesAsync();
    }
}
