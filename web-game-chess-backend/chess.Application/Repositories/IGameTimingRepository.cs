
using chess.Core.Entities;
using chess.Core.Enums;

namespace chess.Application.Repositories;

/// <summary>
/// Game timing repository
/// </summary>
public interface IGameTimingRepository {

    /// <summary>
    /// Get timing by id
    /// </summary>
    /// <param name="timingId"></param>
    /// <returns></returns>
    Task<GameTiming?> GetById(Guid timingId);

    /// <summary>
    /// Gets timing by type and times
    /// </summary>
    /// <param name="type"></param>
    /// <param name="minutes"></param>
    /// <param name="increment"></param>
    /// <returns></returns>
    Task<GameTiming?> FindTiming(TimingTypes type, int seconds, int increment);

    /// <summary>
    /// Creates new timing
    /// </summary>
    /// <param name="gameTiming"></param>
    /// <returns></returns>
    Task Create(GameTiming gameTiming);
}
