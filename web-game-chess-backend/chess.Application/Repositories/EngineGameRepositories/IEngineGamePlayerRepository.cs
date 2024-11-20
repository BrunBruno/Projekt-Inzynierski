
using chess.Core.Entities;

namespace chess.Application.Repositories.EngineGameRepositories;

/// <summary>
/// Engine game player interface
/// </summary>
public interface IEngineGamePlayerRepository {

    /// <summary>
    /// To get all players of engine games for current user
    /// </summary>
    /// <param name="userId"></param>
    /// <returns></returns>
    Task<List<EngineGamePlayer>> GetAllForUser(Guid userId);  

    /// <summary>
    /// Creates user player for engine game 
    /// </summary>
    /// <param name="player"></param>
    /// <returns></returns>       
    Task Create(EngineGamePlayer player);
}
