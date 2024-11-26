
using chess.Application.Repositories.WebGameRepositories;
using chess.Core.Entities;
using chess.Infrastructure.Contexts;
using Microsoft.EntityFrameworkCore;

namespace chess.Infrastructure.Repositories.WebGameRepositories;

public class WebGamePlayerRepository : IWebGamePlayerRepository {

    private readonly ChessAppDbContext _dbContext;

    public WebGamePlayerRepository(ChessAppDbContext dbContext) {
        _dbContext = dbContext;
    }

    ///<inheritdoc/>
    public async Task<List<WebGamePlayer>> GetAllActiveForUser(Guid userId)
        => await _dbContext.WebGamePlayers
                    .Include(p => p.User)
                    .Include(p => p.WhiteGame)
                        .ThenInclude(g => g!.BlackPlayer)
                            .ThenInclude(bp => bp.User)
                    .Include(p => p.BlackGame)
                        .ThenInclude(g => g!.WhitePlayer)
                            .ThenInclude(wp => wp.User)
                    .Where(p => p.UserId == userId && p.IsPlaying == true && p.FinishedGame == false)
                    .OrderByDescending(p => p.CreatedAt)
                    .ToListAsync();

    ///<inheritdoc/>
    public async Task<List<WebGamePlayer>> GetAllFinishedForUser(Guid userId)
        => await _dbContext.WebGamePlayers
                    .Include(p => p.User)
                    .Include(p => p.WhiteGame)
                        .ThenInclude(g => g!.BlackPlayer)
                            .ThenInclude(bp => bp.User)
                    .Include(p => p.BlackGame)
                        .ThenInclude(g => g!.WhitePlayer)
                            .ThenInclude(wp => wp.User)
                    .Where(p => p.UserId == userId && p.IsPlaying == true && p.FinishedGame == true)
                    .OrderByDescending(p => p.CreatedAt)
                    .ToListAsync();

    ///<inheritdoc/>
    public async Task<List<WebGamePlayer>> GetAllAvailablePlayersForTiming(Guid timingId)
        => await _dbContext.WebGamePlayers
                    .Where(p => p.IsPlaying == false && p.IsPrivate == false && p.TimingId == timingId)
                    .OrderByDescending(p => p.CreatedAt)
                    .ToListAsync();

    ///<inheritdoc/>
    public async Task<WebGamePlayer?> GetByUserIdAndGameId(Guid userId, Guid gameId)
        => await _dbContext.WebGamePlayers
                    .Include(p => p.User)
                        .ThenInclude(u => u.Image)
                    .FirstOrDefaultAsync(p => p.UserId == userId && p.GameId == gameId);

    ///<inheritdoc/>
    public async Task<WebGamePlayer?> GetAwaitingPlayer(Guid userId, Guid timingId)
        => await _dbContext.WebGamePlayers
                    .FirstOrDefaultAsync(p => p.UserId == userId && p.TimingId == timingId && p.IsPlaying == false && p.IsPrivate == false);

    ///<inheritdoc/>
    public async Task<WebGamePlayer?> GetById(Guid id)
        => await _dbContext.WebGamePlayers
                    .Include(p => p.Messages)
                    .FirstOrDefaultAsync(p => p.Id == id);

    ///<inheritdoc/>
    public async Task Create(WebGamePlayer player) {
        await _dbContext.WebGamePlayers.AddAsync(player);
        await _dbContext.SaveChangesAsync();
    }

    ///<inheritdoc/>
    public async Task Update(WebGamePlayer player) {
        _dbContext.WebGamePlayers.Update(player);
        await _dbContext.SaveChangesAsync();
    }

    ///<inheritdoc/>
    public async Task Delete(WebGamePlayer player) {
        _dbContext.WebGamePlayers.Remove(player);
        await _dbContext.SaveChangesAsync();
    }
}
