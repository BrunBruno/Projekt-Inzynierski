
using chess.Core.Entities;

namespace chess.Application.Repositories; 

/// <summary>
/// Game repository
/// </summary>
public interface IGameRepository {

    /// <summary>
    /// Gets game where player in one of players
    /// </summary>
    /// <param name="playerId"></param>
    /// <returns></returns>
    Task<Game?> GetGameForPlayer(Guid playerId);

    /// <summary>
    /// Gets game by id
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    Task<Game?> GetById(Guid id);

    /// <summary>
    /// Creates new game
    /// </summary>
    /// <param name="game"></param>
    /// <returns></returns>
    Task Create(Game game);

    /// <summary>
    /// Updates game
    /// </summary>
    /// <param name="game"></param>
    /// <returns></returns>
    Task Update(Game game);

    /// <summary>
    /// Removes game
    /// </summary>
    /// <param name="game"></param>
    /// <returns></returns>
    Task Delete(Game game);
}
