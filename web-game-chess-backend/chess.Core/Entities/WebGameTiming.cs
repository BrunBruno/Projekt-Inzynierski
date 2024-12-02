
using chess.Core.Enums;

namespace chess.Core.Entities;
#pragma warning disable CS8618

/// <summary>
/// Timing entity
/// One type is used for many games
/// </summary>
public class WebGameTiming {

    /// <summary>
    /// Id pk
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
    /// All games with this timing type
    /// </summary>
    public List<WebGame> WebGames { get; set; }
}
