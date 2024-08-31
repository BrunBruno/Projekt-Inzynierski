
using MediatR;

namespace chess.Application.Requests.GameRequests.GetOpponent;

/// <summary>
/// Request used in rematch game creations
/// Gets opponents data
/// </summary>
public class GetOpponentRequest : IRequest<GetOpponentDto> {

    /// <summary>
    /// Previous game id
    /// </summary>
    public Guid GameId { get; set; }
}
