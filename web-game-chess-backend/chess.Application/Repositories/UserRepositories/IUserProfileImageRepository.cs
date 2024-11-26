
using chess.Core.Entities;

namespace chess.Application.Repositories.UserRepositories;

/// <summary>
/// User image repository
/// </summary>
public interface IUserProfileImageRepository {

    /// <summary>
    /// Get user profile picture
    /// </summary>
    /// <param name="userId"></param>
    /// <returns></returns>
    Task<UserProfileImage?> GetByUserId(Guid userId);

    /// <summary>
    /// Creates profile picture
    /// </summary>
    /// <param name="userImage"></param>
    /// <returns></returns>
    Task Create(UserProfileImage userImage);

    /// <summary>
    /// Removes user profile
    /// </summary>
    /// <param name="userImage"></param>
    /// <returns></returns>
    Task Delete(UserProfileImage userImage);
}
