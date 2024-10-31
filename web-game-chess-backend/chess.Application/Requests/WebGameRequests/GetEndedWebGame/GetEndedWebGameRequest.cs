
using MediatR;

namespace chess.Application.Requests.WebGameRequests.GetEndedWebGame;

/// <summary>
/// Request for getting winner of just ended game
/// </summary>
public class GetEndedWebGameRequest : IRequest<GetEndedWebGameDto> {

    /// <summary>
    /// Ended game id
    /// </summary>
    public Guid GameId { get; set; }
}
