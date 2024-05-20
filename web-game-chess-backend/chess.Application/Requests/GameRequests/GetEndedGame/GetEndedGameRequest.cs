
using MediatR;

namespace chess.Application.Requests.GameRequests.GetEndedGame;

public class GetEndedGameRequest : IRequest<GetEndedGameDto> {
    public Guid GameId { get; set; }
}
