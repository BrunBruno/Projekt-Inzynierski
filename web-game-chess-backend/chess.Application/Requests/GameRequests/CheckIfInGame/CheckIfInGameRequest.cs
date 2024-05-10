
using MediatR;

namespace chess.Application.Requests.GameRequests.CheckIfInGame;

public class CheckIfInGameRequest : IRequest<CheckIfInGameDto> {
    public Guid PlayerId { get; set; }
}
