
using chess.Core.Entities;

namespace chess.Application.Repositories.EngineGameRepositories;

/// <summary>
/// Engine game player interface
/// </summary>
public interface IEngineGamePlayerRepository {

    /// <summary>
    /// Creates user player for engine game 
    /// </summary>
    /// <param name="player"></param>
    /// <returns></returns>       
    Task Create(EngineGamePlayer player);
}
