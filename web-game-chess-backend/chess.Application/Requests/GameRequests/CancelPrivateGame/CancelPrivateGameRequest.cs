
using MediatR;

namespace chess.Application.Requests.GameRequests.CancelPrivateGame;

/// <summary>
/// Request to remove private game with player
/// </summary>
public class CancelPrivateGameRequest : IRequest {

    /// <summary>
    /// Game id
    /// </summary>
    public Guid GameId { get; set; }
}
