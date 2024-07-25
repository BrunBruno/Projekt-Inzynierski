
using MediatR;

namespace chess.Application.Requests.GameRequests.FetchTime;

/// <summary>
/// Request to get corrent time left for each player
/// Used to neutrlize accidental refreshes and exits
/// </summary>
public class FetchTimeRequest : IRequest<FetchTimeDto> {

    /// <summary>
    /// Currnt game id
    /// </summary>
    public Guid GameId { get; set; }
}
