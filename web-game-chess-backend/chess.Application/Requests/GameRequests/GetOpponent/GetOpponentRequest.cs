
using MediatR;

namespace chess.Application.Requests.GameRequests.GetOpponent;

public class GetOpponentRequest : IRequest<GetOpponentDto> {
    public Guid GameId { get; set; }
}
