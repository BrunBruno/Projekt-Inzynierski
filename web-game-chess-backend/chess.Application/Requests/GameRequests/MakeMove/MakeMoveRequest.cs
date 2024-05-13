
using MediatR;

namespace chess.Application.Requests.GameRequests.MakeMove;

public class MakeMoveRequest : IRequest {
    public Guid GameId { get; set; }
    public required string Position { get; set; }
}
