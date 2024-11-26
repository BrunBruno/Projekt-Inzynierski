
using MediatR;

namespace chess.Application.Requests.WebGameRequests.CancelWebGameRematch;

/// <summary>
/// Request for canceling rematch offers
/// </summary>
public class CancelWebGameRematchRequest : IRequest {

    /// <summary>
    /// Previous game id
    /// </summary>
    public Guid CurrentGameId { get; set; }

    /// <summary>
    /// Created game id
    /// </summary>
    public Guid NewGameId { get; set; }
}
