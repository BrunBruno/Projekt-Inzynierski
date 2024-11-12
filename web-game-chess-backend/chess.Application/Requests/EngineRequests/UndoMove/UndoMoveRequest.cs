
using MediatR;

namespace chess.Application.Requests.EngineRequests.UndoMove;

/// <summary>
/// Request for undoing moves in engine game
/// </summary>
public class UndoMoveRequest : IRequest {

    /// <summary>
    /// Game id
    /// </summary>
    public Guid GameId { get; set; }
}
