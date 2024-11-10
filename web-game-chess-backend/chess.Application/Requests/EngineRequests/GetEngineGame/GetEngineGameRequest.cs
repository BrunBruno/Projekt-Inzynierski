
using MediatR;

namespace chess.Application.Requests.EngineRequests.GetEngineGame;

public class GetEngineGameRequest : IRequest<GetEngineGameDto> {
    public Guid GameId { get; set; }
}
