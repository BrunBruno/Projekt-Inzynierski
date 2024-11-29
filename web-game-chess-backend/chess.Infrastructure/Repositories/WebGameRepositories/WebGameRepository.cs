
using chess.Application.Repositories.WebGameRepositories;
using chess.Core.Entities;
using chess.Infrastructure.Contexts;
using Microsoft.EntityFrameworkCore;

namespace chess.Infrastructure.Repositories.WebGameRepositories;

public class WebGameRepository : IWebGameRepository {

    private readonly ChessAppDbContext _dbContext;

    public WebGameRepository(ChessAppDbContext dbContext) {
        _dbContext = dbContext;
    }

    ///<inheritdoc/>
    public async Task<WebGame?> GetGameForPlayer(Guid playerId)
        => await _dbContext.WebGames
                    .FirstOrDefaultAsync(g => g.WhitePlayerId == playerId || g.BlackPlayerId == playerId);

    ///<inheritdoc/>
    public async Task<WebGame?> GetById(Guid id)
        => await _dbContext.WebGames
                    .Include(g => g.WhitePlayer)
                        .ThenInclude(p => p.User)
                            .ThenInclude(u => u.Image)
                    .Include(g => g.BlackPlayer)
                        .ThenInclude(p => p.User)
                            .ThenInclude(u => u.Image)
                    .Include(g => g.GameTiming)
                    .Include(g => g.CurrentState)
                    .Include(wg => wg.Moves.OrderBy(m => m.DoneAt))
                    .Include(wg => wg.Messages.OrderBy(m => m.SentAt))
                    .FirstOrDefaultAsync(g => g.Id == id);

    ///<inheritdoc/>
    public async Task<List<WebGame>> GetAllPlayedToday() 
        => await _dbContext.WebGames
                    .Where(wg => wg.CreatedAt.Date == DateTime.UtcNow.Date)
                    .ToListAsync();

    public async Task<List<WebGame>> GetAllForFriendship(Guid requestorId, Guid receiverId)
        => await _dbContext.WebGames
                    .Include(wg => wg.WhitePlayer)
                        .ThenInclude(p => p.User)
                            .ThenInclude(u => u.Image)
                    .Include(wg => wg.BlackPlayer)
                        .ThenInclude(p => p.User)
                            .ThenInclude(u => u.Image)
                    .Where(wg => wg.IsPrivate == true && wg.HasEnded == true &&
                          (wg.WhitePlayer.UserId == requestorId && wg.BlackPlayer.UserId == receiverId) ||
                          (wg.WhitePlayer.UserId == receiverId && wg.BlackPlayer.UserId == requestorId))
                    .ToListAsync();

    ///<inheritdoc/>
    public async Task Create(WebGame game) {
        await _dbContext.WebGames.AddAsync(game);
        await _dbContext.SaveChangesAsync();
    }

    ///<inheritdoc/>
    public async Task Update(WebGame game) {
        _dbContext.WebGames.Update(game);
        await _dbContext.SaveChangesAsync();
    }


    ///<inheritdoc/>
    public async Task Delete(WebGame game) {
        _dbContext.WebGames.Remove(game);
        await _dbContext.SaveChangesAsync();
    }
}
