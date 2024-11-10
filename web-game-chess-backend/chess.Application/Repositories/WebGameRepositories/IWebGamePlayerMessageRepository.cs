
using chess.Core.Entities;

namespace chess.Application.Repositories.WebGameRepositories;

/// <summary>
/// Message repository
/// </summary>
public interface IWebGamePlayerMessageRepository {

    /// <summary>
    /// Gets all messages for players of the game
    /// </summary>
    /// <param name="whitePlayerId"></param>
    /// <param name="blackPlayerId"></param>
    /// <returns></returns>
    Task<List<WebGamePlayerMessage>> GetAllByPlayers(Guid whitePlayerId, Guid blackPlayerId);

    /// <summary>
    /// Creates new message
    /// </summary>
    /// <param name="message"></param>
    /// <returns></returns>
    Task Create(WebGamePlayerMessage message);

    /// <summary>
    /// Removes message
    /// </summary>
    /// <param name="message"></param>
    /// <returns></returns>
    Task Delete(WebGamePlayerMessage message);
}
