
using chess.Core.Entities;
using chess.Core.Enums;

namespace chess.Application.Repositories.WebGameRepositories;

/// <summary>
/// Game timing interface
/// </summary>
public interface IWebGameTimingRepository {

    /// <summary>
    /// Get timing by id
    /// </summary>
    /// <param name="timingId"></param>
    /// <returns></returns>
    Task<WebGameTiming?> GetById(Guid timingId);

    /// <summary>
    /// Gets timing by type and times
    /// </summary>
    /// <param name="type"></param>
    /// <param name="minutes"></param>
    /// <param name="increment"></param>
    /// <returns></returns>
    Task<WebGameTiming?> FindTiming(TimingTypes type, int seconds, int increment);

    /// <summary>
    /// Creates new timing
    /// </summary>
    /// <param name="gameTiming"></param>
    /// <returns></returns>
    Task Create(WebGameTiming gameTiming);
}
