
using MediatR;

namespace chess.Application.Requests.GameRequests.StartGames;

public class StartGamesRequest : IRequest {
    public Guid TimingId { get; set; }
}
