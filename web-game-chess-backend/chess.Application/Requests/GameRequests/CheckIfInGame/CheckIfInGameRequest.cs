
using MediatR;

namespace chess.Application.Requests.GameRequests.CheckIfInGame;

/// <summary>
/// Request for checking if player has been added to game
/// </summary>
public class CheckIfInGameRequest : IRequest<CheckIfInGameDto> {

    /// <summary>
    /// Player id for witch status is checked
    /// </summary>
    public Guid PlayerId { get; set; }
}
