
using chess.Core.Entities;

namespace chess.Application.Repositories.EngineGameRepositories;

/// <summary>
/// Engine game interface
/// </summary>
public interface IEngineGameRepository {

    /// <summary>
    /// Gets game
    /// </summary>
    /// <param name="gameId"></param>
    /// <returns></returns>
    Task<EngineGame?> GetById(Guid gameId);

    /// <summary>
    /// Creates game
    /// </summary>
    /// <param name="game"></param>
    /// <returns></returns>
    Task Create(EngineGame game);

    /// <summary>
    /// Updates game
    /// </summary>
    /// <param name="game"></param>
    /// <returns></returns>
    Task Update(EngineGame game);
}
