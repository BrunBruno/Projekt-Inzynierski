
using MediatR;

namespace chess.Application.Requests.GameRequests.AcceptRematch;

/// <summary>
/// Request for accepting rematch games
/// </summary>
public class AcceptRematchRequest : IRequest<AcceptRematchDto> {

    /// <summary>
    /// New game id
    /// </summary>
    public Guid GameId { get; set; }
}
