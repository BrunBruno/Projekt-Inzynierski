
using chess.Core.Entities;

namespace chess.Application.Repositories.UserRepositories;

/// <summary>
/// Stats repository
/// </summary>
public interface IUserStatsRepository {

    /// <summary>
    /// Updates users stats after game ended
    /// </summary>
    /// <param name="userStats"></param>
    /// <returns></returns>
    Task Update(UserStats userStats);
}
