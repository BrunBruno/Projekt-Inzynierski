using MediatR;


namespace chess.Application.Requests.GameRequests.AbortSearch;

/// <summary>
/// Request when user stops searching for a game
/// Removes Player, only if player is not already playing
/// </summary>
public class AbortSearchRequest : IRequest {

    /// <summary>
    /// Player to remove id
    /// </summary>
    public Guid PlayerId { get; set; }
}
