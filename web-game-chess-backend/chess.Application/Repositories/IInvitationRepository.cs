
using chess.Core.Entities;

namespace chess.Application.Repositories;

/// <summary>
/// Invitation repository
/// </summary>
public interface IInvitationRepository {

    /// <summary>
    /// Gets all previous invitatons for current user
    /// </summary>
    /// <param name="userId"></param>
    /// <returns></returns>
    public Task<List<Invitation>> GetAllForUser(Guid userId);

    /// <summary>
    /// Gets invitation linked to game
    /// </summary>
    /// <param name="gameId"></param>
    /// <returns></returns>
    public Task<Invitation?> GetByGameId(Guid gameId);

    /// <summary>
    /// Creates new invitation
    /// </summary>
    /// <param name="invitation"></param>
    /// <returns></returns>
    public Task Create(Invitation invitation);

    /// <summary>
    /// Updates invitation
    /// </summary>
    /// <param name="invitation"></param>
    /// <returns></returns>
    public Task Update(Invitation invitation);

    /// <summary>
    /// Removes invitation
    /// </summary>
    /// <param name="invitation"></param>
    /// <returns></returns>
    public Task Delete(Invitation invitation);
}
