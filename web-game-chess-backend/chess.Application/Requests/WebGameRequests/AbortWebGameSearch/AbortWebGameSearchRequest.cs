
using MediatR;

namespace chess.Application.Requests.WebGameRequests.AbortWebGameSearch;

/// <summary>
/// Request when user stops searching for a game
/// Removes Player, only if player is not already playing
/// </summary>
public class AbortWebGameSearchRequest : IRequest {

    /// <summary>
    /// Player to remove id
    /// </summary>
    public Guid PlayerId { get; set; }
}
