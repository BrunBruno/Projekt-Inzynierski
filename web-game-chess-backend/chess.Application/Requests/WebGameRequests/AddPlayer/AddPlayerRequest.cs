
using MediatR;

namespace chess.Application.Requests.WebGameRequests.AddPlayer;

public class AddPlayerRequest : IRequest {
    public Guid GameId { get; set; }
}
