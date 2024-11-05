
using chess.Application.Repositories.EngineGameRepositories;
using chess.Core.Entities;
using chess.Infrastructure.Contexts;
using Microsoft.EntityFrameworkCore;

namespace chess.Infrastructure.Repositories.EngineGameRepositories;

public class EngineGameRepository : IEngineGameRepository {

    private readonly ChessAppDbContext _dbContext;

    public EngineGameRepository(ChessAppDbContext dbContext) {
        _dbContext = dbContext;
    }

    ///<inheritdoc/>
    public async Task<EngineGame?> GetById(Guid gameId)
        => await _dbContext.EngineGames
                    .Include(eg => eg.Player)
                        .ThenInclude(egp => egp.User)
                    .Include(eg => eg.CurrentState)
                    .Include(eg => eg.Moves)
                    .FirstOrDefaultAsync(x => x.Id == gameId);

     ///<inheritdoc/>
    public async Task Create(EngineGame game) {
        await _dbContext.EngineGames.AddAsync(game);
        await _dbContext.SaveChangesAsync();
    }

    public async Task Update(EngineGame game) {
        _dbContext.EngineGames.Update(game);
        await _dbContext.SaveChangesAsync();
    }
}
