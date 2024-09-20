
using chess.Core.Entities;

namespace chess.Application.Repositories;

/// <summary>
/// Message repository
/// </summary>
public interface IPlayerMessageRepository {

    /// <summary>
    /// Gets all messages for players of the game
    /// </summary>
    /// <param name="whitePlayerId"></param>
    /// <param name="blackPlayerId"></param>
    /// <returns></returns>
    Task<List<PlayerMessage>> GetAllByPlayers(Guid whitePlayerId, Guid blackPlayerId);

    /// <summary>
    /// 
    /// </summary>
    /// <param name="gameId"></param>
    /// <returns></returns>
    Task<PlayerMessage?> GetDrawMessage(Guid playerId);

    /// <summary>
    /// Creates new message
    /// </summary>
    /// <param name="message"></param>
    /// <returns></returns>
    Task Create(PlayerMessage message);

    /// <summary>
    /// Removes message
    /// </summary>
    /// <param name="message"></param>
    /// <returns></returns>
    Task Delete(PlayerMessage message);
}
