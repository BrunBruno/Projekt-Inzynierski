
using chess.Core.Enums;
using MediatR;

namespace chess.Application.Requests.GameRequests.EndGame;

public class EndGameRequest : IRequest<EndGameDto> {
    public Guid GameId { get; set; }
    public Colors LoserColor { get; set; }
}
