
using chess.Application.Repositories;
using chess.Core.Entities;
using chess.Core.Enums;
using chess.Infrastructure.Contexts;
using Microsoft.EntityFrameworkCore;

namespace chess.Infrastructure.Repositories;

public class PlayerMessageRepository : IPlayerMessageRepository {

    private readonly ChessAppDbContext _dbContext;

    public PlayerMessageRepository(ChessAppDbContext dbContext) {
        _dbContext = dbContext;
    }

    ///<inheritdoc/>
    public async Task<List<PlayerMessage>> GetAllByPlayers(Guid whitePlayerId, Guid blackPlayerrId)
        => await _dbContext.PlayerMessages
                    .Include(m => m.Player)
                    .Where(m => m.PlayerId == whitePlayerId || m.PlayerId == blackPlayerrId)
                    .OrderBy(m => m.SentAt)
                    .ToListAsync();

    ///<inheritdoc/>
    public async Task<PlayerMessage?> GetDrawMessage(Guid playerId)
        => await _dbContext.PlayerMessages
                    .FirstOrDefaultAsync(m => m.PlayerId == playerId && m.Type == MessageType.DrawAction);

    ///<inheritdoc/>
    public async Task Create(PlayerMessage message) {
        await _dbContext.PlayerMessages.AddAsync(message);
        await _dbContext.SaveChangesAsync();
    }

    ///<inheritdoc/>
    public async Task Delete(PlayerMessage message) {
        _dbContext.PlayerMessages.Remove(message);
        await _dbContext.SaveChangesAsync();
    }
}
