
namespace chess.Core.Abstraction;

/// <summary>
/// Abstract game states entity
/// </summary>
public abstract class GameState {

    /// <summary>
    /// Coordinates of en passant if it is possible in form x,y
    /// </summary>
    public string? EnPassant { get; set; } = null;

    /// <summary>
    /// If white can still castle
    /// </summary>
    public bool CanWhiteKingCastle { get; set; } = true;

    /// <summary>
    /// If white can castle short
    /// </summary>
    public bool CanWhiteShortRookCastle { get; set; } = true;

    /// <summary>
    /// If white can castle long
    /// </summary>
    public bool CanWhiteLongRookCastle { get; set; } = true;

    /// <summary>
    /// If black king can still castle
    /// </summary>
    public bool CanBlackKingCastle { get; set; } = true;

    /// <summary>
    /// If black can castle short
    /// </summary>
    public bool CanBlackShortRookCastle { get; set; } = true;

    /// <summary>
    /// If black can castle short
    /// </summary>
    public bool CanBlackLongRookCastle { get; set; } = true;

    /// <summary>
    /// Every non pawn move in row
    /// For 50 move rule
    /// </summary>
    public int HalfMove { get; set; } = 0;
}
