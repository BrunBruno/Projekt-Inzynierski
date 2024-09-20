
using chess.Core.Entities;

namespace chess.Application.Repositories;

/// <summary>
/// Message repository
/// </summary>
public interface IGameMessageRepository {

    /// <summary>
    /// Gets all auto messages for game
    /// </summary>
    /// <param name="whiteGameId"></param>
    /// <param name="blackGameId"></param>
    /// <returns></returns>
    Task<List<GameMessage>> GetAll(Guid gameId);

    /// <summary>
    /// 
    /// </summary>
    /// <param name="gameId"></param>
    /// <returns></returns>
    Task<GameMessage?> GetDrawMessage(Guid gameId);

    /// <summary>
    /// Creates new message
    /// </summary>
    /// <param name="message"></param>
    /// <returns></returns>
    Task Create(GameMessage message);

    /// <summary>
    /// Removes message
    /// </summary>
    /// <param name="message"></param>
    /// <returns></returns>
    Task Delete(GameMessage message);
}
