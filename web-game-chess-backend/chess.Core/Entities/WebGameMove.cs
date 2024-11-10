
using chess.Core.Abstraction;

namespace chess.Core.Entities;
#pragma warning disable CS8618

/// <summary>
/// Each done move representation
/// </summary>
public class WebGameMove : Move {

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
    public double BlackTime {  get; set; }

    /// <summary>
    /// game id
    /// </summary>
    public Guid GameId { get; set; }

    /// <summary>
    /// Game for which moves belong to
    /// </summary>
    public WebGame Game {  get; set; }
}
