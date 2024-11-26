
using chess.Core.Entities;

namespace chess.Application.Repositories.WebGameRepositories;

/// <summary>
/// Web game invitation repository
/// </summary>
public interface IWebGameInvitationRepository {

    /// <summary>
    /// Gets all previous invitations for current user
    /// </summary>
    /// <param name="userId"></param>
    /// <returns></returns>
    Task<List<WebGameInvitation>> GetAllForUser(Guid userId);

    /// <summary>
    /// Gets invitation linked to game
    /// </summary>
    /// <param name="gameId"></param>
    /// <returns></returns>
    Task<WebGameInvitation?> GetByGameId(Guid gameId);

    /// <summary>
    /// Creates new invitation
    /// </summary>
    /// <param name="invitation"></param>
    /// <returns></returns>
    Task Create(WebGameInvitation invitation);

    /// <summary>
    /// Updates invitation
    /// </summary>
    /// <param name="invitation"></param>
    /// <returns></returns>
    Task Update(WebGameInvitation invitation);

    /// <summary>
    /// Removes invitation
    /// </summary>
    /// <param name="invitation"></param>
    /// <returns></returns>
    Task Delete(WebGameInvitation invitation);
}
