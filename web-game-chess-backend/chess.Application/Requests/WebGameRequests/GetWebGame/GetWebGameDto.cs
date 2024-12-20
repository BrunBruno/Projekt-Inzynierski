﻿
using chess.Core.Dtos;
using chess.Core.Enums;

namespace chess.Application.Requests.WebGameRequests.GetWebGame;

/// <summary>
/// Dto representing ongoing game
/// </summary>
public class GetWebGameDto {

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
    /// En passant coordinates if en passant is possible in form x,y
    /// </summary>
    public string? EnPassant { get; set; }

    /// <summary>
    /// Timing type of game
    /// </summary>
    public TimingTypes TimingType { get; set; }

    /// <summary>
    /// For 50 move rule ending
    /// </summary>
    public int HalfmoveClock { get; set; }


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
    public required PlayerDto WhitePlayer { get; set; }

    /// <summary>
    /// Black Player data
    /// </summary>
    public required PlayerDto BlackPlayer { get; set; }

    /// <summary>
    /// List of moves that was made during game
    /// </summary>
    public required List<MoveDto> Moves { get; set; }

    /// <summary>
    /// Game settings based on user settings
    /// </summary>
    public required GameSettingsDto GameSettings { get; set; }
}



