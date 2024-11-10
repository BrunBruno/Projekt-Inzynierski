
using MediatR;

namespace chess.Application.Requests.WebGameRequests.GetPlayer;

/// <summary>
/// Request for getting player data for current game
/// </summary>
public class GetPlayerRequest : IRequest<GetPlayerDto> {

    /// <summary>
    /// Game id
    /// </summary>
    public Guid GameId { get; set; }
}
