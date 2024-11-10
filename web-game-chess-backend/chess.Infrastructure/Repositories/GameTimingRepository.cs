
using chess.Application.Repositories;
using chess.Core.Entities;
using chess.Core.Enums;
using chess.Infrastructure.Contexts;
using Microsoft.EntityFrameworkCore;

namespace chess.Infrastructure.Repositories;

public class GameTimingRepository : IGameTimingRepository {

    private readonly ChessAppDbContext _dbContext;

    public GameTimingRepository(ChessAppDbContext dbContext) {
        _dbContext = dbContext;
    }

    ///<inheritdoc/>
    public async Task<GameTiming?> GetById(Guid timigId)
        => await _dbContext.GameTimings
                    .FirstOrDefaultAsync(t => t.Id == timigId);

    ///<inheritdoc/>
    public async Task<GameTiming?> FindTiming(TimingTypes type, int seconds, int increment)
        => await _dbContext.GameTimings
                    .FirstOrDefaultAsync(t => t.Type == type && t.Seconds == seconds && t.Increment == increment);

    ///<inheritdoc/>
    public async Task Create(GameTiming gameTiming) {
        await _dbContext.GameTimings.AddAsync(gameTiming);
        await _dbContext.SaveChangesAsync();
    }
}
