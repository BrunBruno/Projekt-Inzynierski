
using chess.Core.Entities;

namespace chess.Application.Repositories.EngineGameRepositories;

/// <summary>
/// Engine game message interface
/// </summary>
public interface IEngineGameMessageRepository {

    /// <summary>
    /// Gets all game messages
    /// </summary>
    /// <param name="gameId"></param>
    /// <returns></returns>
    Task<List<EngineGameMessage>> GetAllForGame(Guid gameId);    

    /// <summary>
    /// Creates message
    /// </summary>
    /// <param name="message"></param>
    /// <returns></returns>
    Task Create(EngineGameMessage message);
}
