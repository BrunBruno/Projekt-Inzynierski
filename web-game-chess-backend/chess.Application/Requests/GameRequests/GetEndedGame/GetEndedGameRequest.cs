
using MediatR;

namespace chess.Application.Requests.GameRequests.GetEndedGame;

/// <summary>
/// Request for getting winner of just ended game
/// </summary>
public class GetEndedGameRequest : IRequest<GetEndedGameDto> {

    /// <summary>
    /// Ended game id
    /// </summary>
    public Guid GameId { get; set; }
}
