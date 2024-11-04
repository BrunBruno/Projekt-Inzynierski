
using MediatR;

namespace chess.Application.Requests.EngineRequests.GetEngineGameMove;

public class GetEngineGameMoveRequest : IRequest<GetEngineGameMoveDto> {
    public Guid GameId { get; set; }

}
