
using chess.Core.Enums;

namespace chess.Application.Requests.Abstraction;

/// <summary>
/// Abstrac class for all request that creates new game
/// </summary>
public abstract class TimingType {

    /// <summary>
    /// Type of timing
    /// </summary>
    public TimingTypes Type { get; set; }

    /// <summary>
    /// Duration of the game for one player
    /// Gets converted to seconds
    /// </summary>
    public int Minutes { get; set; }

    /// <summary>
    /// Time increment for every done move
    /// </summary>
    public int Increment { get; set; }
}
