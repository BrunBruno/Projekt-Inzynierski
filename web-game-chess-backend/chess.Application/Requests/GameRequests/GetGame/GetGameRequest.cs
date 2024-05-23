
using MediatR;

namespace chess.Application.Requests.GameRequests.GetGame; 

/// <summary>
/// Request for getting current played game
/// </summary>
public class GetGameRequest : IRequest<GetGameDto> {

    /// <summary>
    /// Game id to get
    /// </summary>
    public Guid GameId { get; set; }
}
