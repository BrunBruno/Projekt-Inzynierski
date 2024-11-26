
using chess.Core.Entities;

namespace chess.Application.Repositories.UserRepositories;

/// <summary>
/// User background interface
/// </summary>
public interface IUserBackgroundImageRepository {

    /// <summary>
    /// Get user background image
    /// </summary>
    /// <param name="userId"></param>
    /// <returns></returns>
    Task<UserBackgroundImage?> GetByUserId(Guid userId);

    /// <summary>
    /// Creates profile background
    /// </summary>
    /// <param name="userImage"></param>
    /// <returns></returns>
    Task Create(UserBackgroundImage userImage);

    /// <summary>
    /// Removes user background
    /// </summary>
    /// <param name="userImage"></param>
    /// <returns></returns>
    Task Delete(UserBackgroundImage userImage);
}
