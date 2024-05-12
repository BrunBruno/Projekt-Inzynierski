
using MediatR;

namespace chess.Application.Requests.GameRequests.CheckIfInGame;

/// <summary>
/// 
/// </summary>
public class CheckIfInGameRequest : IRequest<CheckIfInGameDto> {

    /// <summary>
    /// 
    /// </summary>
    public Guid PlayerId { get; set; }
}
