
using MediatR;

namespace chess.Application.Requests.EngineRequests.GetEngineGameWinner;

/// <summary>
/// Request for getting engine game winner
/// </summary>
public class GetEngineGameWinnerRequest : IRequest<GetEngineGameWinnerDto> {

    /// <summary>
    /// Current game id
    /// </summary>
    public Guid GameId { get; set; }
}
