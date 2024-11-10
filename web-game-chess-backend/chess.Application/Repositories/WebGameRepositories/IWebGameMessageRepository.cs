
using chess.Core.Entities;

namespace chess.Application.Repositories.WebGameRepositories;

/// <summary>
/// Message repository
/// </summary>
public interface IWebGameMessageRepository {

    /// <summary>
    /// Gets all games messages for current game
    /// </summary>
    /// <param name="gameId"></param>
    /// <returns></returns>
    Task<List<WebGameMessage>> GetAll(Guid gameId);

    /// <summary>
    /// Gets draw message for current game
    /// </summary>
    /// <param name="gameId"></param>
    /// <returns></returns>
    Task<WebGameMessage?> GetDrawMessage(Guid gameId);

    /// <summary>
    /// Creates new message
    /// </summary>
    /// <param name="message"></param>
    /// <returns></returns>
    Task Create(WebGameMessage message);

    /// <summary>
    /// Removes message
    /// </summary>
    /// <param name="message"></param>
    /// <returns></returns>
    Task Delete(WebGameMessage message);
}
