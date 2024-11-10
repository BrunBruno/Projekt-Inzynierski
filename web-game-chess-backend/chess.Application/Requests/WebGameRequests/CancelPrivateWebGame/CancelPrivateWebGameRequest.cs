
using MediatR;

namespace chess.Application.Requests.WebGameRequests.CancelPrivateWebGame;

/// <summary>
/// Request to remove private game with player
/// </summary>
public class CancelPrivateWebGameRequest : IRequest {

    /// <summary>
    /// Game id
    /// </summary>
    public Guid GameId { get; set; }
}
