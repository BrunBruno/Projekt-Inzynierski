
using MediatR;

namespace chess.Application.Requests.EngineRequests.FetchEngineGameTime;

public class FetchEngineGameTimeRequest : IRequest<FetchEngineGameTimeDto> {

    public Guid GameId { get; set; }
}
