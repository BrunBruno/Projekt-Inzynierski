
using chess.Core.Entities;

namespace chess.Application.Repositories;

public interface IInvitationRepository {
    public Task<List<Invitation>> GetAllForUser(Guid userId);
    public Task<Invitation?> GetByGameId(Guid gameId);
    public Task Create(Invitation invitation);
    public Task Update(Invitation invitation);
    public Task Delete(Invitation invitation);
}
