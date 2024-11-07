using chess.Core.Entities;

namespace chess.Application.Repositories.WebGameRepositories;

/// <summary>
/// Game repository
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
    /// To get all games that happend in current day
    /// </summary>
    /// <returns></returns>
    Task<List<WebGame>> GetAllPlayedTotay();

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
