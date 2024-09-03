
using MediatR;

namespace chess.Application.Requests.GameRequests.CancelPrivateGame;

public class CancelPrivateGameRequest : IRequest {

    public Guid GameId { get; set; }
}
