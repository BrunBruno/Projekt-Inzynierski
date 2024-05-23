
using chess.Core.Entities;

namespace chess.Application.Repositories;

/// <summary>
/// Player repository
/// </summary>
public interface IPlayerRepository {

    /// <summary>
    /// Gets all players of user
    /// </summary>
    /// <param name="userId"></param>
    /// <returns></returns>
    Task<List<Player>> GetAllForUser(Guid userId);

    /// <summary>
    /// Get all awaiting players for specifing timing
    /// </summary>
    /// <param name="timingId"></param>
    /// <returns></returns>
    Task<List<Player>> GetAllAvailablePlayersForTiming(Guid timingId);

    /// <summary>
    /// Get by user and game
    /// </summary>
    /// <param name="userId"></param>
    /// <param name="gameId"></param>
    /// <returns></returns>
    Task<Player?> GetByUserIdandGameId(Guid userId, Guid gameId);

    /// <summary>
    /// Gets player that is not in game yet
    /// </summary>
    /// <param name="userId"></param>
    /// <param name="timingId"></param>
    /// <returns></returns>
    Task<Player?> GetAwaitingPlayer(Guid userId, Guid timingId);

    /// <summary>
    /// Get by id
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    Task<Player?> GetById(Guid id);

    /// <summary>
    /// Creates new player
    /// </summary>
    /// <param name="player"></param>
    /// <returns></returns>
    Task Create(Player player);

    /// <summary>
    /// Updates player data
    /// </summary>
    /// <param name="player"></param>
    /// <returns></returns>
    Task Update(Player player);

    /// <summary>
    /// Removes player
    /// </summary>
    /// <param name="player"></param>
    /// <returns></returns>
    Task Delete(Player player);
}
