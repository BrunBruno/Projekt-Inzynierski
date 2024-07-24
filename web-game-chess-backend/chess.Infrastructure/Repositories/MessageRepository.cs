
using chess.Application.Repositories;
using chess.Core.Entities;
using chess.Infrastructure.Contexts;

namespace chess.Infrastructure.Repositories;

public class MessageRepository : IMessageRepository {

    private readonly ChessAppDbContext _dbContext;

    public MessageRepository(ChessAppDbContext dbContext) {
        _dbContext = dbContext;
    }

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
