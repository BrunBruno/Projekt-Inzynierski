
using chess.Core.Enums;

namespace chess.Core.Entities;
#pragma warning disable CS8618

/// <summary>
/// Timing entity
/// One type is used for many games
/// </summary>
public class GameTiming {

    /// <summary>
    /// Id
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// Timing type
    /// </summary>
    public TimingTypes Type { get; set; }

    /// <summary>
    /// Duration of the game
    /// </summary>
    public int Seconds { get; set; }

    /// <summary>
    /// Time increment (in seconds)
    /// </summary>
    public int Increment { get; set; }

    /// <summary>
    /// Games with this timing type
    /// </summary>
    public List<WebGame> WebGames { get; set; }
    public List<EngineGame> EngineGames { get; set; }
}
