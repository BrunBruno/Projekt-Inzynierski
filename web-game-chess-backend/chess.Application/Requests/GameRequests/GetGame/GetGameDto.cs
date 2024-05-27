
namespace chess.Application.Requests.GameRequests.GetGame;
#pragma warning disable CS8618

/// <summary>
/// Dto representing ongoing game
/// </summary>
public class GetGameDto {

    /// <summary>
    /// Has game ended
    /// </summary>
    public bool HasEnded { get; set; }

    /// <summary>
    /// Current position
    /// </summary>
    public string Position { get; set; }

    /// <summary>
    /// Current turn
    /// </summary>
    public int Turn { get; set; }

    /// <summary>
    /// En passant coordinates if enpassant is possible in form x,y
    /// </summary>
    public string? EnPassant { get; set; }

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
    /// White player data
    /// </summary>
    public GetGamePlayerDto WhitePlayer { get; set; }

    /// <summary>
    /// Black Player data
    /// </summary>
    public GetGamePlayerDto BlackPlayer { get; set; }

    /// <summary>
    /// List of moves that was made during game
    /// </summary>
    public List<GetGameMoveDto> Moves { get; set; }

}

/// <summary>
/// Playe data
/// </summary>
public class GetGamePlayerDto {

    /// <summary>
    /// User name
    /// </summary>
    public string Name { get; set; }

    /// <summary>
    /// Avatar
    /// </summary>
    public string? ImageUrl { get; set; }

    /// <summary>
    /// Elo points
    /// </summary>
    public int Elo { get; set; }

    public double TimeLeft { get; set; }
}

/// <summary>
/// Done move
/// </summary>
public class GetGameMoveDto {

    /// <summary>
    /// Done move in form: 
    /// piece tag + x (if capture) + coordinates xy + # if check
    /// </summary>
    public string Move { get; set; }

    /// <summary>
    /// Turn at which move was made
    /// </summary>
    public int Turn { get; set; }

    /// <summary>
    /// Coordinates from
    /// </summary>
    public string OldCoor { get; set; }

    /// <summary>
    /// Coordinates to
    /// </summary>
    public string NewCoor { get; set; }

    /// <summary>
    /// Capture piece tag
    /// </summary>
    public string? CapturedPiece { get; set; }
}

