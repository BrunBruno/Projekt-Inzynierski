
using chess.Core.Abstraction;

#pragma warning disable CS8618
namespace chess.Core.Entities;

/// <summary>
/// Moves for engine game
/// </summary>
public class EngineGameMove : Move {

    /// <summary>
    /// Id
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// Time left for white player
    /// </summary>
    public double WhiteTime { get; set; }

    /// <summary>
    /// Time left for black player
    /// </summary>
    public double BlackTime { get; set; }

    /// <summary>
    /// game id
    /// </summary>
    public Guid GameId { get; set; }

    /// <summary>
    /// Game for which moves belong to
    /// </summary>
    public EngineGame Game { get; set; }
}
