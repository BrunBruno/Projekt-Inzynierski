
using chess.Core.Enums;

namespace chess.Core.Abstraction;

/// <summary>
/// Abstract player entity
/// </summary>
public abstract class Player {

    /// <summary>
    /// User name
    /// </summary>
    public required string Name { get; set; }

    /// <summary>
    /// Color of player (black or white)
    /// Null when player is still searching for a game
    /// </summary>
    public PieceColor? Color { get; set; } = null;

    /// <summary>
    /// Creating of player
    /// To arrange waiting queue
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Time left fro all moves according to game timing
    /// </summary>
    public double TimeLeft { get; set; }
}
