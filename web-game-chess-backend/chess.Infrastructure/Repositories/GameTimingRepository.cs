
using chess.Application.Repositories;
using chess.Core.Entities;
using chess.Core.Enums;
using chess.Infrastructure.Contexts;
using Microsoft.EntityFrameworkCore;

namespace chess.Infrastructure.Repositories;

internal class GameTimingRepository : IGameTimingRepository {

    private readonly ChessAppDbContext _dbContext;

    public GameTimingRepository(ChessAppDbContext dbContext) {
        _dbContext = dbContext;
    }

    public async Task<GameTiming?> FindTiming(TimingTypes type, int minutes, int increment)
        => await _dbContext.GameTimings
                    .FirstOrDefaultAsync(t => (t.Type == type && t.Minutes == minutes && t.Increment == increment));

    public async Task Create(GameTiming gameTiming) {
        await _dbContext.GameTimings.AddAsync(gameTiming);
        await _dbContext.SaveChangesAsync();
    }

    
}
