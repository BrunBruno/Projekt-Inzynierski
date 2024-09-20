
using chess.Application.Repositories;
using chess.Core.Entities;
using chess.Core.Enums;
using chess.Infrastructure.Contexts;
using Microsoft.EntityFrameworkCore;

namespace chess.Infrastructure.Repositories;

public class GameMessageRepository : IGameMessageRepository {

    private readonly ChessAppDbContext _dbContext;

    public GameMessageRepository(ChessAppDbContext dbContext) {
        _dbContext = dbContext;
    }

    ///<inheritdoc/>
    public async Task<List<GameMessage>> GetAll(Guid gameId)
        => await _dbContext.GameMessages
                    .Include(m => m.Game)
                    .Where(m => m.GameId == gameId)
                    .OrderBy(m => m.SentAt)
                    .ToListAsync();

    ///<inheritdoc/>
    public async Task<GameMessage?> GetDrawMessage(Guid gameId)
        => await _dbContext.GameMessages
                    .FirstOrDefaultAsync(m => m.GameId == gameId && m.Type == MessageType.DrawAction);

    ///<inheritdoc/>
    public async Task Create(GameMessage message) {
        await _dbContext.GameMessages.AddAsync(message);
        await _dbContext.SaveChangesAsync();
    }

    ///<inheritdoc/>
    public async Task Delete(GameMessage message) {
        _dbContext.GameMessages.Remove(message);
        await _dbContext.SaveChangesAsync();
    }
}
