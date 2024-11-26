
using chess.Application.Repositories.WebGameRepositories;
using chess.Core.Entities;
using chess.Core.Enums;
using chess.Infrastructure.Contexts;
using Microsoft.EntityFrameworkCore;

namespace chess.Infrastructure.Repositories.WebGameRepositories;

public class WebGameTimingRepository : IWebGameTimingRepository
{

    private readonly ChessAppDbContext _dbContext;

    public WebGameTimingRepository(ChessAppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    ///<inheritdoc/>
    public async Task<WebGameTiming?> GetById(Guid timigId)
        => await _dbContext.GameTimings
                    .FirstOrDefaultAsync(t => t.Id == timigId);

    ///<inheritdoc/>
    public async Task<WebGameTiming?> FindTiming(TimingTypes type, int seconds, int increment)
        => await _dbContext.GameTimings
                    .FirstOrDefaultAsync(t => t.Type == type && t.Seconds == seconds && t.Increment == increment);

    ///<inheritdoc/>
    public async Task Create(WebGameTiming gameTiming) {
        await _dbContext.GameTimings.AddAsync(gameTiming);
        await _dbContext.SaveChangesAsync();
    }
}
