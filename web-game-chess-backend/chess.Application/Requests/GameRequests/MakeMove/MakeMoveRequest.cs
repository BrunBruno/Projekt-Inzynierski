
using MediatR;

namespace chess.Application.Requests.GameRequests.MakeMove;

public class MakeMoveRequest : IRequest {
    public Guid GameId { get; set; }
    public required string Position { get; set; }
    public required string DoneMove { get; set; }
    public string? EnPassant { get; set; }
    public bool WhiteKingMoved { get; set; }
    public bool WhiteShortRookMoved { get; set; }
    public bool WhiteLongRookMoved { get; set; }
    public bool BlackKingMoved { get; set; }
    public bool BlackShortRookMoved { get; set; }
    public bool BlackLongRookMoved { get; set; }
}
