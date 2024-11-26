
using chess.Core.Entities;

namespace chess.Application.Repositories.UserRepositories;

/// <summary>
/// User settings interface
/// </summary>
public interface IUserSettingsRepository {

    /// <summary>
    /// To get user settings by user id
    /// </summary>
    /// <param name="userId"></param>
    /// <returns></returns>
    Task <UserSettings?> GetByUserId(Guid userId);  

    /// <summary>
    /// Updates users account and game settings
    /// </summary>
    /// <param name="userSettings"></param>
    /// <returns></returns>
    Task Update(UserSettings userSettings);
}
