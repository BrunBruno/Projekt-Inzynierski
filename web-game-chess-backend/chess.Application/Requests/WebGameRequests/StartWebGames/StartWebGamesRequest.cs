
using MediatR;

namespace chess.Application.Requests.WebGameRequests.StartWebGames;

/// <summary>
/// Request for matching all awaiting player in queue
/// </summary>
public class StartWebGamesRequest : IRequest {

    /// <summary>
    /// Timing for which games should be started
    /// </summary>
    public Guid TimingId { get; set; }
}
