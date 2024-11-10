
using MediatR;

namespace chess.Application.Requests.WebGameRequests.CancelRematch;

public class CancelRematchRequest : IRequest {

    public Guid CurrentGameId { get; set; }
    public Guid NewGameId { get; set; }
}
