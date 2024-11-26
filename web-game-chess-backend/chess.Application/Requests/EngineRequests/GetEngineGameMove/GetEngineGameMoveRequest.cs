
using MediatR;

namespace chess.Application.Requests.EngineRequests.GetEngineGameMove;

/// <summary>
/// Request for obtaining moves done by engine
/// </summary>
public class GetEngineGameMoveRequest : IRequest<GetEngineGameMoveDto> {

    /// <summary>
    /// Game id
    /// </summary>
    public Guid GameId { get; set; }
}
