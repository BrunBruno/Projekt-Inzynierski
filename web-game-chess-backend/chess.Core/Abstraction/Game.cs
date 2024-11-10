
using chess.Core.Enums;

namespace chess.Core.Abstraction;

/// <summary>
/// Abstract game entity
/// </summary>
public abstract class Game {

    /// <summary>
    /// Current position of game
    /// </summary>
    public string Position { get; set; } = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";

    /// <summary>
    /// Current FEN position
    /// </summary>
    public string FenPosition { get; set; } = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

    /// <summary>
    /// Bool flag if game has ended
    /// </summary>
    public bool HasEnded { get; set; } = false;

    /// <summary>
    /// Date of creation
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Time when game started
    /// </summary>
    public DateTime? StartedAt { get; set; } = null;

    /// <summary>
    /// Time when game has ended
    /// </summary>
    public DateTime? EndedAt { get; set; } = null;

    /// <summary>
    /// Turn of game
    /// </summary>
    public int Turn { get; set; } = 0;

    /// <summary>
    /// Round of game (both players moved)
    /// Fullmove
    /// </summary>
    public int Round { get; set; } = 1;

    /// <summary>
    /// Winner color (null is draw)
    /// </summary>
    public PieceColor? WinnerColor { get; set; } = null;
}
