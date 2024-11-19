
using MediatR;

namespace chess.Application.Requests.WebGameRequests.CheckIfInWebGame;

/// <summary>
/// Request for checking if player has been added to game
/// </summary>
public class CheckIfInWebGameRequest : IRequest<CheckIfInWebGameDto> {

    /// <summary>
    /// Player id for witch status is checked
    /// </summary>
    public Guid PlayerId { get; set; }
}
