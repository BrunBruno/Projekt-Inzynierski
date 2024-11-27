
using MediatR;

namespace chess.Application.Requests.WebGameRequests.GetWinner;

/// <summary>
/// Request for getting winner data
/// </summary>
public class GetWinnerRequest : IRequest<GetWinnerDto> {

    /// <summary>
    /// Current game id
    /// </summary>
    public Guid GameId { get; set; }
}
