
using MediatR;

namespace chess.Application.Requests.GameRequests.GetGameTiming;

public class GetGameTimingRequest : IRequest<GetGameTimingDto> {
    public Guid GameId { get; set; }
}
