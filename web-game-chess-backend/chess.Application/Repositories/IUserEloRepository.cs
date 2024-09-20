
using chess.Core.Entities;

namespace chess.Application.Repositories; 

/// <summary>
/// Elo repository
/// </summary>
public interface IUserEloRepository {

    /// <summary>
    /// Updates elo after game ended
    /// </summary>
    /// <param name="elo"></param>
    /// <returns></returns>
    Task Update(UserElo elo);
}
