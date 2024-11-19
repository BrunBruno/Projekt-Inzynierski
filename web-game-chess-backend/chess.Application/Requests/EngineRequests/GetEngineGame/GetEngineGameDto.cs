
using chess.Core.Dtos;
using chess.Core.Enums;

namespace chess.Application.Requests.EngineRequests.GetEngineGame;

/// <summary>
/// Dto representing engine game
/// </summary>
public class GetEngineGameDto {

    /// <summary>
    /// Has game ended
    /// </summary>
    public bool HasEnded { get; set; }

    /// <summary>
    /// Current position
    /// </summary>
    public required string Position { get; set; }

    /// <summary>
    /// Current turn
    /// </summary>
    public int Turn { get; set; }

    /// <summary>
    /// Selected engine level
    /// </summary>
    public int EngineLevel { get; set; }

    /// <summary>
    /// En passant coordinates if en passant is possible in form x,y
    /// </summary>
    public string? EnPassant { get; set; }

    /// <summary>
    /// If player allowed move undoing
    /// </summary>
    public bool AllowUndo { get; set; }

    /// <summary>
    /// Bool values relate to castling options
    /// </summary>
    public bool CanWhiteKingCastle { get; set; }
    public bool CanWhiteShortRookCastle { get; set; }
    public bool CanWhiteLongRookCastle { get; set; }
    public bool CanBlackKingCastle { get; set; }
    public bool CanBlackShortRookCastle { get; set; }
    public bool CanBlackLongRookCastle { get; set; }

    /// <summary>
    /// User player
    /// </summary>
    public required PlayerDto Player { get; set; }

    /// <summary>
    /// List of moves that was made during game
    /// </summary>
    public required List<MoveDto> Moves { get; set; }

    /// <summary>
    /// Game settings based on user settings
    /// </summary>
    public required GameSettingsDto GameSettings { get; set; }
}
