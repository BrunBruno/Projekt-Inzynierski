
using chess.Core.Enums;

namespace chess.Core.Entities;
#pragma warning disable CS8618

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
    /// Duretion of the game
    /// </summary>
    public int Seconds { get; set; }

    /// <summary>
    /// Time increment (in seconds)
    /// </summary>
    public int Increment { get; set; }

    /// <summary>
    /// Games with this timeing type
    /// </summary>
    public List<Game> Games { get; set; }
}
