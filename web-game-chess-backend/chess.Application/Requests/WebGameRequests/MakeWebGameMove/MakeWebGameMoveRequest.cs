﻿
using MediatR;

namespace chess.Application.Requests.WebGameRequests.MakeWebGameMove;

/// <summary>
/// Request for creating new move for current game
/// </summary>
public class MakeWebGameMoveRequest : IRequest {

    /// <summary>
    /// Current game id
    /// </summary>
    public Guid GameId { get; set; }

    /// <summary>
    /// New position after move was done
    /// </summary>
    public required string Position { get; set; }

    /// <summary>
    /// Done move in form:
    /// piece tag + x (if capture) + coordinates xy + # if check
    /// </summary>
    public required string Move { get; set; }

    /// <summary>
    /// Done move in fen notation
    /// </summary>
    public required string FenMove { get; set; }

    /// <summary>
    /// Coordinates from x,y
    /// </summary>
    public required string OldCoor { get; set; }

    /// <summary>
    /// Coordinates to x,y
    /// </summary>
    public required string NewCoor { get; set; }

    /// <summary>
    /// Piece tag is capture happened
    /// </summary>
    public string? CapturedPiece { get; set; }

    /// <summary>
    /// Coordinates for en passant if possible (else null)
    /// </summary>
    public string? EnPassant { get; set; }

    /// <summary>
    /// True is pieces used for castling just moved
    /// </summary>
    public bool WhiteKingMoved { get; set; }
    public bool WhiteShortRookMoved { get; set; }
    public bool WhiteLongRookMoved { get; set; }
    public bool BlackKingMoved { get; set; }
    public bool BlackShortRookMoved { get; set; }
    public bool BlackLongRookMoved { get; set; }
}
