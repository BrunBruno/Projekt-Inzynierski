
using MediatR;

namespace chess.Application.Requests.WebGameRequests.GetGameTiming;

/// <summary>
/// Request to get timing type of current game
/// </summary>
public class GetGameTimingRequest : IRequest<GetGameTimingDto> {

    /// <summary>
    /// Current game id
    /// </summary>
    public Guid GameId { get; set; }
}
