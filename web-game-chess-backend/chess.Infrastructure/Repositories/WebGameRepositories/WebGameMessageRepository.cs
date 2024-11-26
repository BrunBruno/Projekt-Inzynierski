
using chess.Application.Repositories.WebGameRepositories;
using chess.Core.Entities;
using chess.Core.Enums;
using chess.Infrastructure.Contexts;
using Microsoft.EntityFrameworkCore;

namespace chess.Infrastructure.Repositories.WebGameRepositories;

public class WebGameMessageRepository : IWebGameMessageRepository {

    private readonly ChessAppDbContext _dbContext;

    public WebGameMessageRepository(ChessAppDbContext dbContext) {
        _dbContext = dbContext;
    }

    ///<inheritdoc/>
    public async Task<List<WebGameMessage>> GetAll(Guid gameId)
        => await _dbContext.WebGameMessages
                    .Include(m => m.Game)
                    .Where(m => m.GameId == gameId)
                    .OrderBy(m => m.SentAt)
                    .ToListAsync();

    ///<inheritdoc/>
    public async Task<WebGameMessage?> GetDrawMessage(Guid gameId)
        => await _dbContext.WebGameMessages
                    .FirstOrDefaultAsync(m => m.GameId == gameId && m.Type == MessageType.DrawAction);

    ///<inheritdoc/>
    public async Task Create(WebGameMessage message) {
        await _dbContext.WebGameMessages.AddAsync(message);
        await _dbContext.SaveChangesAsync();
    }

    ///<inheritdoc/>
    public async Task Delete(WebGameMessage message) {
        _dbContext.WebGameMessages.Remove(message);
        await _dbContext.SaveChangesAsync();
    }
}
