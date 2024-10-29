
using MediatR;

namespace chess.Application.Requests.EngineRequests.MakeMoves;

public class MakeMovesRequest : IRequest<MakeMovesDto> {

    public Guid GameId { get; set; }
    public required string Position { get; set; }
    public required string Move { get; set; }
}
