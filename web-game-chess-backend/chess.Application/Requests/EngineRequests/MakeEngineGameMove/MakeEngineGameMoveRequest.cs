
using MediatR;

namespace chess.Application.Requests.EngineRequests.MakeEngineGameMove;

public class MakeEngineGameMoveRequest : IRequest<MakeEngineGameMoveDto> {

    public Guid GameId { get; set; }
    public required string Position { get; set; }
    public required string Move { get; set; }
}
