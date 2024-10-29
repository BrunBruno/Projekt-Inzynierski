
using chess.Application.Repositories.WebGameRepositories;
using chess.Core.Entities;
using chess.Infrastructure.Contexts;
using Microsoft.EntityFrameworkCore;

namespace chess.Infrastructure.Repositories.WebGameRepositories;

public class WebGameInvitationRepository : IWebGameInvitationRepository {

    private readonly ChessAppDbContext _dbContext;

    public WebGameInvitationRepository(ChessAppDbContext dbContext) {
        _dbContext = dbContext;
    }

    ///<inheritdoc/>
    public async Task<List<WebGameInvitation>> GetAllForUser(Guid userId)
        => await _dbContext.WebGameInvitations
                    .Where(i => i.InviteeId == userId && i.IsAccepted == false)
                    .OrderByDescending(i => i.CreatedAt)
                    .ToListAsync();

    ///<inheritdoc/>
    public async Task<WebGameInvitation?> GetByGameId(Guid gameId)
        => await _dbContext.WebGameInvitations
                    .FirstOrDefaultAsync(i => i.GameId == gameId);

    ///<inheritdoc/>
    public async Task Create(WebGameInvitation invitation) {
        await _dbContext.WebGameInvitations.AddAsync(invitation);
        await _dbContext.SaveChangesAsync();
    }

    ///<inheritdoc/>
    public async Task Update(WebGameInvitation invitation) {
        _dbContext.WebGameInvitations.Update(invitation);
        await _dbContext.SaveChangesAsync();
    }

    ///<inheritdoc/>
    public async Task Delete(WebGameInvitation invitation) {
        _dbContext.WebGameInvitations.Remove(invitation);
        await _dbContext.SaveChangesAsync();
    }
}
