
using MediatR;

namespace chess.Application.Requests.WebGameRequests.GetWebGamePlayer;

/// <summary>
/// Request for getting player data for current game
/// </summary>
public class GetWebGamePlayerRequest : IRequest<GetWebGamePlayerDto> {

    /// <summary>
    /// Game id
    /// </summary>
    public Guid GameId { get; set; }
}
