
using chess.Core.Entities;

namespace chess.Application.Repositories.EngineGameRepositories;

/// <summary>
/// 
/// </summary>
public interface IEngineGameMessageRepository {

    /// <summary>
    /// 
    /// </summary>
    /// <param name="gameId"></param>
    /// <returns></returns>
    Task<List<EngineGameMessage>> GetAllForGame(Guid gameId);    

    /// <summary>
    /// 
    /// </summary>
    /// <param name="message"></param>
    /// <returns></returns>
    Task Create(EngineGameMessage message);
}
