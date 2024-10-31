
using MediatR;

namespace chess.Application.Requests.WebGameRequests.GetWebGame; 

/// <summary>
/// Request for getting current played game
/// </summary>
public class GetWebGameRequest : IRequest<GetWebGameDto> {

    /// <summary>
    /// Game id to get
    /// </summary>
    public Guid GameId { get; set; }
}
