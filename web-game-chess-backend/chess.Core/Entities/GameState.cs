
namespace chess.Core.Entities;
#pragma warning disable CS8618

/// <summary>
/// States of game (belongs only to one game)
/// </summary>
public class GameState {

    /// <summary>
    /// Id
    /// </summary>
    public Guid Id { get; set; }

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
    /// Game id
    /// </summary>
    public Guid GameId { get; set; }

    /// <summary>
    /// Game for which states belong to
    /// </summary>
    public Game Game { get; set; }
}
