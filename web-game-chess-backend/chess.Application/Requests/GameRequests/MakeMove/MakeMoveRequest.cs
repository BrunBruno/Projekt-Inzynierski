
using MediatR;

namespace chess.Application.Requests.GameRequests.MakeMove;

/// <summary>
/// Request for creating new move for current game
/// </summary>
public class MakeMoveRequest : IRequest {

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
    /// Coordinates for enpassatng if possible (else null)
    /// </summary>
    public string? EnPassant { get; set; }

    /// <summary>
    /// True is pieces used for castling just moved
    /// </summary>
    public bool Wkm { get; set; }
    public bool Wsrm { get; set; }
    public bool Wlrm { get; set; }
    public bool Bkm { get; set; }
    public bool Bsrm { get; set; }
    public bool Blrm { get; set; }

    /// <summary>
    /// 
    /// </summary>
    public int WhiteSeconds { get; set; }
    public int BlackSeconds { get; set; }
}
