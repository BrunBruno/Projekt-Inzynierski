
using chess.Core.Entities;

namespace chess.Application.Repositories.EngineGameRepositories;

/// <summary>
/// Engine game interface
/// </summary>
public interface IEngineGameMoveRepository {

    /// <summary>
    /// 
    /// </summary>
    /// <param name="gameId"></param>
    /// <returns></returns>
    Task <List<EngineGameMove>> GetAllForGame(Guid gameId);

    /// <summary>
    /// 
    /// </summary>
    /// <param name="move"></param>
    /// <returns></returns>
    Task Create(EngineGameMove move);

    /// <summary>
    /// 
    /// </summary>
    /// <param name="move"></param>
    /// <returns></returns>
    Task Delete(EngineGameMove move);
}
