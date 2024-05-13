
using MediatR;

namespace chess.Application.Requests.GameRequests.GetPlayer;

public class GetPlayerRequest : IRequest<GetPlayerDto> {
    public Guid GameId { get; set; }
}
