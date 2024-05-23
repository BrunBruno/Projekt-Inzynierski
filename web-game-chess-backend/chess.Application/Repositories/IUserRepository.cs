
using chess.Core.Entities;

namespace chess.Application.Repositories;

/// <summary>
/// User repository
/// </summary>
public interface IUserRepository {

    Task<List<User>> GetAllNonFriends(List<Guid> ids);

    /// <summary>
    /// Get user by id
    /// </summary>
    /// <param name="id"> user id </param>
    /// <returns> User or null </returns>
    Task<User?> GetById(Guid id);

    /// <summary>
    /// Gets user by email
    /// </summary>
    /// <param name="email"> user email </param>
    /// <returns> User or null </returns>
    Task<User?> GetByEmail(string email);

    /// <summary>
    /// Creates user
    /// </summary>
    /// <param name="user"> User </param>
    /// <returns></returns>
    Task Add(User user);

    /// <summary>
    /// Updates user data
    /// </summary>
    /// <param name="user"> User </param>
    /// <returns></returns>
    Task Update(User user);

    /// <summary>
    /// Deletes user
    /// </summary>
    /// <param name="user"> User </param>
    /// <returns></returns>
    Task Delete(User user);

}
