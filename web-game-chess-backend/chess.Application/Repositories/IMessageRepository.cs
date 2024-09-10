
using chess.Core.Entities;

namespace chess.Application.Repositories;

/// <summary>
/// Message repository
/// </summary>
public interface IMessageRepository {

    /// <summary>
    /// Gets all messages for players of the game
    /// </summary>
    /// <param name="whitePlayerId"></param>
    /// <param name="blackPlayerId"></param>
    /// <returns></returns>
    Task<List<Message>> GetAllByPlayers(Guid whitePlayerId, Guid blackPlayerId);

    /// <summary>
    /// 
    /// </summary>
    /// <param name="gameId"></param>
    /// <returns></returns>
    Task<Message?> GetDrawMessage(Guid playerId);

    /// <summary>
    /// Creates new message
    /// </summary>
    /// <param name="message"></param>
    /// <returns></returns>
    Task Create(Message message);

    /// <summary>
    /// Removes message
    /// </summary>
    /// <param name="message"></param>
    /// <returns></returns>
    Task Delete(Message message);
}
