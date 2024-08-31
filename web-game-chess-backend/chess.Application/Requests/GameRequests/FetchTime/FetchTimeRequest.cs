
using MediatR;

namespace chess.Application.Requests.GameRequests.FetchTime;

/// <summary>
/// Request to get correct time left for each player
/// Used to neutralize accidental refreshes and exits
/// </summary>
public class FetchTimeRequest : IRequest<FetchTimeDto> {

    /// <summary>
    /// Current game id
    /// </summary>
    public Guid GameId { get; set; }
}
