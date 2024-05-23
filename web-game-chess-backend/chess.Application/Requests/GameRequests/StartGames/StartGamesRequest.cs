
using MediatR;

namespace chess.Application.Requests.GameRequests.StartGames;

/// <summary>
/// Request for matching all awaiting player in queue
/// </summary>
public class StartGamesRequest : IRequest {

    /// <summary>
    /// Timing for whch games should be started
    /// </summary>
    public Guid TimingId { get; set; }
}
