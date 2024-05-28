
using MediatR;

namespace chess.Application.Requests.GameRequests.FetchTime;

public class FetchTimeRequest : IRequest<FetchTimeDto> {
    public Guid GameId { get; set; }
}
