
using chess.Core.Entities;

namespace chess.Application.Repositories.WebGameRepositories;

/// <summary>
/// Web g
/// ame repository
/// </summary>
public interface IWebGameRepository {

    /// <summary>
    /// Gets game where player in one of players
    /// </summary>
    /// <param name="playerId"></param>
    /// <returns></returns>
    Task<WebGame?> GetGameForPlayer(Guid playerId);

    /// <summary>
    /// Gets game by id
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    Task<WebGame?> GetById(Guid id);

    /// <summary>
    /// To get all games that happened in current day
    /// </summary>
    /// <returns></returns>
    Task<List<WebGame>> GetAllPlayedToday();

    /// <summary>
    /// To get all games for friendship
    /// </summary>
    /// <param name="requestorId"></param>
    /// <param name="receiverId"></param>
    /// <returns></returns>
    Task<List<WebGame>> GetAllForFriendship(Guid requestorId, Guid receiverId);

    /// <summary>
    /// To game all unfinished games, to check if should end
    /// </summary>
    /// <returns></returns>
    Task<List<WebGame>> GetAllOngoing();

    /// <summary>
    /// Creates new game
    /// </summary>
    /// <param name="game"></param>
    /// <returns></returns>
    Task Create(WebGame game);

    /// <summary>
    /// Updates game
    /// </summary>
    /// <param name="game"></param>
    /// <returns></returns>
    Task Update(WebGame game);

    /// <summary>
    /// Removes game
    /// </summary>
    /// <param name="game"></param>
    /// <returns></returns>
    Task Delete(WebGame game);
}
