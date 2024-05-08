
using MediatR;

namespace chess.Application.Requests.GameRequests.SearchGame;

public class SearchGameRequest : IRequest {
    public Guid? PlayerId { get; set; }
    public int Shift { get; set; }
}
