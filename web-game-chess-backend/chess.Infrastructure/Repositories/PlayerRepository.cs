
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


    public async Task<List<Player>> GetAllAvailablePlayersForTiming(Guid timingId)
        => await _dbContext.Players
                    .Where(p => (p.IsPlaying == false && p.TimingId == timingId))
                    .ToListAsync();

    public async Task<Player?> GetById(Guid id)
        => await _dbContext.Players
                    .FirstOrDefaultAsync(p => p.Id == id);

    public async Task Create(Player player) {
        await _dbContext.Players.AddAsync(player);
        await _dbContext.SaveChangesAsync();
    }

    public async Task Update(Player player) {
        _dbContext.Players.Update(player);
        await _dbContext.SaveChangesAsync();
    }

    public async Task Delete(Player player) {
        _dbContext.Players.Remove(player);
        await _dbContext.SaveChangesAsync();
    }

  
}
