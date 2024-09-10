
using chess.Application.Repositories;
using chess.Core.Entities;
using chess.Core.Enums;
using chess.Infrastructure.Contexts;
using Microsoft.EntityFrameworkCore;

namespace chess.Infrastructure.Repositories;

public class MessageRepository : IMessageRepository {

    private readonly ChessAppDbContext _dbContext;

    public MessageRepository(ChessAppDbContext dbContext) {
        _dbContext = dbContext;
    }

    ///<inheritdoc/>
    public async Task<List<Message>> GetAllByPlayers(Guid whitePlayerId, Guid blackPlayerrId)
        => await _dbContext.Messages
                    .Include(m => m.Player)
                    .Where(m => m.PlayerId == whitePlayerId || m.PlayerId == blackPlayerrId)
                    .OrderBy(m => m.SentAt)
                    .ToListAsync();

    ///<inheritdoc/>
    public async Task<Message?> GetDrawMessage(Guid playerId)
        => await _dbContext.Messages
                    .FirstOrDefaultAsync(m => m.PlayerId == playerId && m.Type == MessageType.DrawAction);

    ///<inheritdoc/>
    public async Task Create(Message message) {
        await _dbContext.Messages.AddAsync(message);
        await _dbContext.SaveChangesAsync();
    }

    ///<inheritdoc/>
    public async Task Delete(Message message) {
        _dbContext.Messages.Remove(message);
        await _dbContext.SaveChangesAsync();
    }
}
