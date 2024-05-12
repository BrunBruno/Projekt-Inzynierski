
using chess.Core.Entities;

namespace chess.Application.Repositories; 

/// <summary>
/// 
/// </summary>
public interface IGameRepository {

    /// <summary>
    /// 
    /// </summary>
    /// <param name="playerId"></param>
    /// <returns></returns>
    Task<Game?> GetGameForPlayer(Guid playerId);

    /// <summary>
    /// 
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    Task<Game?> GetById(Guid id);

    /// <summary>
    /// 
    /// </summary>
    /// <param name="game"></param>
    /// <returns></returns>
    Task Create(Game game);
}
