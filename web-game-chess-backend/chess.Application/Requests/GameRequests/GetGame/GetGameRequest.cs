
using MediatR;

namespace chess.Application.Requests.GameRequests.GetGame; 

public class GetGameRequest : IRequest<GetGameDto> {
    public Guid GameId { get; set; }
}
