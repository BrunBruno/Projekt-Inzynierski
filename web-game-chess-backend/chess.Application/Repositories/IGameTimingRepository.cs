
using chess.Core.Entities;
using chess.Core.Enums;

namespace chess.Application.Repositories;

/// <summary>
/// 
/// </summary>
public interface IGameTimingRepository {

    /// <summary>
    /// 
    /// </summary>
    /// <param name="timigId"></param>
    /// <returns></returns>
    Task<GameTiming?> GetById(Guid timigId);

    /// <summary>
    /// 
    /// </summary>
    /// <param name="type"></param>
    /// <param name="minutes"></param>
    /// <param name="increment"></param>
    /// <returns></returns>
    Task<GameTiming?> FindTiming(TimingTypes type, int minutes, int increment);

    /// <summary>
    /// 
    /// </summary>
    /// <param name="gameTiming"></param>
    /// <returns></returns>
    Task Create(GameTiming gameTiming);
}
