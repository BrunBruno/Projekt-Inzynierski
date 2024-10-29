
namespace chess.Core.Abstraction;

/// <summary>
/// Abstract move entity
/// </summary>
public abstract class Move {

    /// <summary>
    /// Done move in form:
    /// piece tag + x if capture + coordinates xy + # if check
    /// </summary>
    public required string DoneMove { get; set; }

    /// <summary>
    /// Coordinates from where piece was moved
    /// </summary>
    public required string OldCoordinates { get; set; }

    /// <summary>
    /// Coordinates to where piece was moved
    /// </summary>
    public required string NewCoordinates { get; set; }

    /// <summary>
    /// Position after move was done
    /// </summary>
    public required string Position { get; set; }

    /// <summary>
    /// Turn when moved happened
    /// </summary>
    public int Turn { get; set; }

    /// <summary>
    /// captured piece tag
    /// </summary>
    public string? CapturedPiece { get; set; }

    /// <summary>
    /// Date adn time when move was made
    /// </summary>
    public DateTime DoneAt { get; set; } = DateTime.UtcNow;
}
