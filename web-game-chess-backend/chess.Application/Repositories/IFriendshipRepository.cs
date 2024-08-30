
using chess.Core.Entities;
using chess.Core.Enums;

namespace chess.Application.Repositories;

/// <summary>
/// Friendship repository
/// </summary>
public interface IFriendshipRepository {

    /// <summary>
    /// Gets all friendship for user, with given status
    /// </summary>
    /// <param name="userId"></param>
    /// <param name="status"></param>
    /// <returns></returns>
    Task<List<Friendship>> GetAllForUserByStatus(Guid userId, FriendshipStatus status);

    /// <summary>
    /// Gets ids of all users that have relation with current user
    /// </summary>
    /// <param name="userId"></param>
    /// <returns></returns>
    Task<List<Guid>> GetAllFriendIds(Guid userId, FriendshipStatus? status = null);

    /// <summary>
    /// Get friendship with id
    /// </summary>
    /// <param name="friendshipId"></param>
    /// <returns></returns>
    Task<Friendship?> GetById(Guid friendshipId);

    /// <summary>
    /// To get friendship by both counterparty ids
    /// </summary>
    /// <returns></returns>
    Task<Friendship?> GetByUsersIds(Guid requesotId, Guid receiverId);

    /// <summary>
    /// Creates new friendship
    /// </summary>
    /// <param name="friendship"></param>
    /// <returns></returns>
    Task Create(Friendship friendship);

    /// <summary>
    /// Updaates friendship
    /// </summary>
    /// <param name="friendship"></param>
    /// <returns></returns>
    Task Update(Friendship friendship);

    /// <summary>
    /// Removes friendship
    /// </summary>
    /// <param name="friendship"></param>
    /// <returns></returns>
    Task Delete(Friendship friendship);

}
