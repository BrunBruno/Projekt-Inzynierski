
namespace chess.Core.Entities;
#pragma warning disable CS8618

/// <summary>
/// Each done move representation
/// </summary>
public class Move {

    /// <summary>
    /// Id
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// Done move in form:
    /// piece tag + x if capture + coordinates xy + # if check
    /// </summary>
    public string DoneMove { get; set; }

    /// <summary>
    /// Coordinates from where piece was moved
    /// </summary>
    public string OldCoordinates { get; set; }

    /// <summary>
    /// Coordinates to where piece was moved
    /// </summary>
    public string NewCoordinates { get; set; }

    /// <summary>
    /// Position after move was done
    /// </summary>
    public string Position { get; set; }

    /// <summary>
    /// Turn when moved happened
    /// </summary>
    public int Turn { get; set; }

    /// <summary>
    /// captured piece tag
    /// </summary>
    public string? CapturedPiece { get; set; }

    /// <summary>
    /// Time left for white player
    /// </summary>
    public double WhiteTime { get; set; }

    /// <summary>
    /// Time left for black player
    /// </summary>
    public double BlackTime {  get; set; }

    /// <summary>
    /// Date adn time when move was made
    /// </summary>
    public DateTime DoneAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// game id
    /// </summary>
    public Guid GameId { get; set; }

    /// <summary>
    /// Game for which moves belong to
    /// </summary>
    public Game Game {  get; set; }
}
