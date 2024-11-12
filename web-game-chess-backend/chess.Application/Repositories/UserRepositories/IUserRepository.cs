
using chess.Core.Entities;
using chess.Core.Enums;

namespace chess.Application.Repositories.UserRepositories;

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
    /// Gets all users, that have established relationship with current user
    /// </summary>
    /// <param name="ids"></param>
    /// <param name="userId"></param>
    /// <returns></returns>
    Task<List<User>> GetAllFriends(List<Guid> ids, Guid userId);

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
    /// Gets user by unique username
    /// </summary>
    /// <param name="username"></param>
    /// <returns></returns>
    Task<User?> GetByUsername(string username);

    /// <summary>
    /// Gets user by email or username
    /// </summary>
    /// <param name="email"></param>
    /// <param name="username"></param>
    /// <returns></returns>
    Task<User?> GetByEmailOrUsername(string value);

    /// <summary>
    /// To get all users that joined today
    /// </summary>
    /// <returns></returns>
    Task<List<User>> GetAllJoinedToday();

    /// <summary>
    /// Tp get users ranking
    /// </summary>
    /// <param name="type"></param>
    /// <returns></returns>
    Task<List<User>> GetAllOrderByRating(TimingTypes type);

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
