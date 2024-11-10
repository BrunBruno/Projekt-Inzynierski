
using MediatR;

namespace chess.Application.Requests.EngineRequests.UndoMove;

/// <summary>
/// 
/// </summary>
public class UndoMoveRequest : IRequest {

    /// <summary>
    /// 
    /// </summary>
    public Guid GameId { get; set; }
}
