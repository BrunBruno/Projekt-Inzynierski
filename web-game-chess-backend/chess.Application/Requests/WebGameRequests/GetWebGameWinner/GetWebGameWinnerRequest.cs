
using MediatR;

namespace chess.Application.Requests.WebGameRequests.GetWebGameWinner;

/// <summary>
/// Request for getting winner data
/// </summary>
public class GetWebGameWinnerRequest : IRequest<GetWebGameWinnerDto> {

    /// <summary>
    /// Current game id
    /// </summary>
    public Guid GameId { get; set; }
}
