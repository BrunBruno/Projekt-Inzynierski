
using chess.Core.Entities;

namespace chess.Application.Repositories;

/// <summary>
/// User repository
/// </summary>
public interface IUserRepository {

    /// <summary>
    /// Gets all users, that have not established relationship with current user
    /// </summary>
    /// <param name="ids"></param>
    /// <param name="userId"></param>
    /// <returns></returns>
    Task<List<User>> GetAllNonFriends(List<Guid> ids, Guid userId);

    /// <summary>
    /// Get user by id
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    Task<User?> GetById(Guid id);

    /// <summary>
    /// Gets user by email
    /// </summary>
    /// <param name="email"></param>
    /// <returns></returns>
    Task<User?> GetByEmail(string email);

    /// <summary>
    /// Creates user
    /// </summary>
    /// <param name="user"></param>
    /// <returns></returns>
    Task Add(User user);

    /// <summary>
    /// Updates user data
    /// </summary>
    /// <param name="user"></param>
    /// <returns></returns>
    Task Update(User user);

    /// <summary>
    /// Deletes user
    /// </summary>
    /// <param name="user"></param>
    /// <returns></returns>
    Task Delete(User user);

}
