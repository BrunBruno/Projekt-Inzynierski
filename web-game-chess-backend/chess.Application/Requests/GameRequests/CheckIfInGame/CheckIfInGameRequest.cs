
using MediatR;

namespace chess.Application.Requests.GameRequests.CheckIfInGame;

/// <summary>
/// Request for chechking is playe has beed added to game
/// </summary>
public class CheckIfInGameRequest : IRequest<CheckIfInGameDto> {

    /// <summary>
    /// Player id for witch status is checked
    /// </summary>
    public Guid PlayerId { get; set; }
}
