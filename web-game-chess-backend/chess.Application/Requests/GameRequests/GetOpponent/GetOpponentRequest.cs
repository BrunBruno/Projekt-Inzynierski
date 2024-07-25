
using MediatR;

namespace chess.Application.Requests.GameRequests.GetOpponent;

/// <summary>
/// Request used in remach game creations
/// Gets opponets data
/// </summary>
public class GetOpponentRequest : IRequest<GetOpponentDto> {

    /// <summary>
    /// Previous game id
    /// </summary>
    public Guid GameId { get; set; }
}
