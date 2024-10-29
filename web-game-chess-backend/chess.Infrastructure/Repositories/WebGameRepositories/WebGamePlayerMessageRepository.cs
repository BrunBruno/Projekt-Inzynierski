
using chess.Application.Repositories.WebGameRepositories;
using chess.Core.Entities;
using chess.Infrastructure.Contexts;
using Microsoft.EntityFrameworkCore;

namespace chess.Infrastructure.Repositories.WebGameRepositories;

public class WebGamePlayerMessageRepository : IWebGamePlayerMessageRepository {

    private readonly ChessAppDbContext _dbContext;

    public WebGamePlayerMessageRepository(ChessAppDbContext dbContext) {
        _dbContext = dbContext;
    }

    ///<inheritdoc/>
    public async Task<List<WebGamePlayerMessage>> GetAllByPlayers(Guid whitePlayerId, Guid blackPlayerId)
        => await _dbContext.WebGamePlayerMessages
                    .Include(m => m.Player)
                    .Where(m => m.PlayerId == whitePlayerId || m.PlayerId == blackPlayerId)
                    .OrderBy(m => m.SentAt)
                    .ToListAsync();

    ///<inheritdoc/>
    public async Task Create(WebGamePlayerMessage message) {
        await _dbContext.WebGamePlayerMessages.AddAsync(message);
        await _dbContext.SaveChangesAsync();
    }

    ///<inheritdoc/>
    public async Task Delete(WebGamePlayerMessage message) {
        _dbContext.WebGamePlayerMessages.Remove(message);
        await _dbContext.SaveChangesAsync();
    }
}
