
using MediatR;

namespace chess.Application.Requests.WebGameRequests.AddPlayerToWebGame;

/// <summary>
/// Request for validating addition to game hub group
/// </summary>
public class AddPlayerToWebGameRequest : IRequest {

    /// <summary>
    /// Game id
    /// </summary>
    public Guid GameId { get; set; }
}
