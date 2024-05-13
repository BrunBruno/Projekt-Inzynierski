
using chess.Core.Entities;

namespace chess.Application.Repositories;

/// <summary>
/// 
/// </summary>
public interface IPlayerRepository {

    /// <summary>
    /// 
    /// </summary>
    /// <param name="timingId"></param>
    /// <returns></returns>
    Task<List<Player>> GetAllAvailablePlayersForTiming(Guid timingId);

    /// <summary>
    /// 
    /// </summary>
    /// <param name="userId"></param>
    /// <param name="gameId"></param>
    /// <returns></returns>
    Task<Player?> GetByUserIdandGameId(Guid userId, Guid gameId);

    /// <summary>
    /// 
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    Task<Player?> GetById(Guid id);

    /// <summary>
    /// 
    /// </summary>
    /// <param name="player"></param>
    /// <returns></returns>
    Task Create(Player player);

    /// <summary>
    /// 
    /// </summary>
    /// <param name="player"></param>
    /// <returns></returns>
    Task Update(Player player);

    /// <summary>
    /// 
    /// </summary>
    /// <param name="player"></param>
    /// <returns></returns>
    Task Delete(Player player);
}
