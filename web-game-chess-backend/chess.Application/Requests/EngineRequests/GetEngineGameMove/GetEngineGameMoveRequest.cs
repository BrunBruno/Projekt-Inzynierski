
using MediatR;

namespace chess.Application.Requests.EngineRequests.GetEngineGameMove;

public class GetEngineGameMoveRequest : IRequest {
    public Guid GameId { get; set; }

}
