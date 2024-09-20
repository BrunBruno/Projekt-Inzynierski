
using chess.Core.Entities;

namespace chess.Application.Repositories;

/// <summary>
/// Invitation repository
/// </summary>
public interface IGameInvitationRepository {

    /// <summary>
    /// Gets all previous invitations for current user
    /// </summary>
    /// <param name="userId"></param>
    /// <returns></returns>
    public Task<List<GameInvitation>> GetAllForUser(Guid userId);

    /// <summary>
    /// Gets invitation linked to game
    /// </summary>
    /// <param name="gameId"></param>
    /// <returns></returns>
    public Task<GameInvitation?> GetByGameId(Guid gameId);

    /// <summary>
    /// Creates new invitation
    /// </summary>
    /// <param name="invitation"></param>
    /// <returns></returns>
    public Task Create(GameInvitation invitation);

    /// <summary>
    /// Updates invitation
    /// </summary>
    /// <param name="invitation"></param>
    /// <returns></returns>
    public Task Update(GameInvitation invitation);

    /// <summary>
    /// Removes invitation
    /// </summary>
    /// <param name="invitation"></param>
    /// <returns></returns>
    public Task Delete(GameInvitation invitation);
}
