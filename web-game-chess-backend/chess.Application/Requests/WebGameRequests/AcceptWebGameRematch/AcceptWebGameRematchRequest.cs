
using MediatR;

namespace chess.Application.Requests.WebGameRequests.AcceptWebGameRematch;

/// <summary>
/// Request for accepting rematch games
/// </summary>
public class AcceptWebGameRematchRequest : IRequest<AcceptWebGameRematchDto> {

    /// <summary>
    /// New game id
    /// </summary>
    public Guid GameId { get; set; }
}
