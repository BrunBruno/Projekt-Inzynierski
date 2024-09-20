
using chess.Application.Repositories;
using chess.Core.Entities;
using chess.Infrastructure.Contexts;
using Microsoft.EntityFrameworkCore;

namespace chess.Infrastructure.Repositories;

public class GameInvitationRepository : IGameInvitationRepository {

    private readonly ChessAppDbContext _dbContext;

    public GameInvitationRepository(ChessAppDbContext dbContext) {
        _dbContext = dbContext;
    }

    ///<inheritdoc/>
    public async Task<List<GameInvitation>> GetAllForUser(Guid userId)
    => await _dbContext.Invitations
                .Where(i => i.InviteeId == userId && i.IsAccepted == false)
                .OrderByDescending(i => i.CreatedAt)
                .ToListAsync();

    ///<inheritdoc/>
    public async Task<GameInvitation?> GetByGameId(Guid gameId)
        => await _dbContext.Invitations
                    .FirstOrDefaultAsync(i => i.GameId == gameId);

    ///<inheritdoc/>
    public async Task Create(GameInvitation invitation) {
        await _dbContext.Invitations.AddAsync(invitation);
        await _dbContext.SaveChangesAsync();
    }

    ///<inheritdoc/>
    public async Task Update(GameInvitation invitation) {
        _dbContext.Invitations.Update(invitation);
        await _dbContext.SaveChangesAsync();
    }

    ///<inheritdoc/>
    public async Task Delete(GameInvitation invitation) {
        _dbContext.Invitations.Remove(invitation);
        await _dbContext.SaveChangesAsync();
    }
}
