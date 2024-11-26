
using chess.Core.Entities;

namespace chess.Application.Repositories.EngineGameRepositories;

/// <summary>
/// Engine game move interface
/// </summary>
public interface IEngineGameMoveRepository {

    /// <summary>
    /// Gets all done move
    /// </summary>
    /// <param name="gameId"></param>
    /// <returns></returns>
    Task <List<EngineGameMove>> GetAllForGame(Guid gameId);

    /// <summary>
    /// Creates move
    /// </summary>
    /// <param name="move"></param>
    /// <returns></returns>
    Task Create(EngineGameMove move);

    /// <summary>
    /// Removes move 
    /// For move undoing
    /// </summary>
    /// <param name="move"></param>
    /// <returns></returns>
    Task Delete(EngineGameMove move);
}
