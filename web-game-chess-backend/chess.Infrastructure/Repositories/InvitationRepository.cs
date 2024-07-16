
using chess.Application.Repositories;
using chess.Core.Entities;
using chess.Infrastructure.Contexts;
using Microsoft.EntityFrameworkCore;

namespace chess.Infrastructure.Repositories;

public class InvitationRepository : IInvitationRepository {

    private readonly ChessAppDbContext _dbContext;

    public InvitationRepository(ChessAppDbContext dbContext) {
        _dbContext = dbContext;
    }

    public async Task<List<Invitation>> GetAllForUser(Guid userId)
    => await _dbContext.Invitations
                .Where(i => i.InviteeId == userId && i.IsAccepted == false)
                .OrderByDescending(i => i.CreatedAt)
                .ToListAsync();


    public async Task<Invitation?> GetByGameId(Guid gameId)
        => await _dbContext.Invitations
                    .FirstOrDefaultAsync(i => i.GameId == gameId);


    public async Task Create(Invitation invitation) {
        await _dbContext.Invitations.AddAsync(invitation);
        await _dbContext.SaveChangesAsync();
    }


    public async Task Update(Invitation invitation) {
        _dbContext.Invitations.Update(invitation);
        await _dbContext.SaveChangesAsync();
    }

    public async Task Delete(Invitation invitation) {
        _dbContext.Invitations.Remove(invitation);
        await _dbContext.SaveChangesAsync();
    }
}
