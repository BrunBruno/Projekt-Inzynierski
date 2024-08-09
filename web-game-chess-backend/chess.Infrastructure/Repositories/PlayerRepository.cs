
using chess.Application.Repositories;
using chess.Core.Entities;
using chess.Infrastructure.Contexts;
using Microsoft.EntityFrameworkCore;

namespace chess.Infrastructure.Repositories;

public class PlayerRepository : IPlayerRepository {

    private readonly ChessAppDbContext _dbContext;

    public PlayerRepository(ChessAppDbContext dbContext) {
        _dbContext = dbContext;
    }

    ///<inheritdoc/>
    public async Task<List<Player>> GetAllForUser(Guid userId) 
        => await _dbContext.Players
                    .Include(p => p.WhiteGame)
                        .ThenInclude(g => g.BlackPlayer)
                    .Include(p => p.BlackGame)
                        .ThenInclude(g => g.WhitePlayer)
                    .Where(p => p.UserId == userId && p.FinishedGame == true)
                    .OrderByDescending(p => p.CreatedAt)
                    .ToListAsync();

    ///<inheritdoc/>
    public async Task<List<Player>> GetAllAvailablePlayersForTiming(Guid timingId)
        => await _dbContext.Players
                    .Where(p => p.IsPlaying == false && p.TimingId == timingId)
                    .OrderByDescending(p => p.CreatedAt)
                    .ToListAsync();

    ///<inheritdoc/>
    public async Task<Player?> GetByUserIdAndGameId(Guid userId, Guid gameId) 
        => await _dbContext.Players
                    .FirstOrDefaultAsync(p => p.UserId == userId && p.GameId == gameId);

    ///<inheritdoc/>
    public async Task<Player?> GetAwaitingPlayer(Guid userId, Guid timingId)
        => await _dbContext.Players
                    .FirstOrDefaultAsync(p => p.UserId == userId && p.TimingId == timingId && p.IsPlaying == false);

    ///<inheritdoc/>
    public async Task<Player?> GetById(Guid id)
        => await _dbContext.Players
                    .Include(p => p.Messages)
                    .FirstOrDefaultAsync(p => p.Id == id);

    ///<inheritdoc/>
    public async Task Create(Player player) {
        await _dbContext.Players.AddAsync(player);
        await _dbContext.SaveChangesAsync();
    }

    ///<inheritdoc/>
    public async Task Update(Player player) {
        _dbContext.Players.Update(player);
        await _dbContext.SaveChangesAsync();
    }

    ///<inheritdoc/>
    public async Task Delete(Player player) {
        _dbContext.Players.Remove(player);
        await _dbContext.SaveChangesAsync();
    }
}
