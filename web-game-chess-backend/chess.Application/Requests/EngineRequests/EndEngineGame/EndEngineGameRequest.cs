
using chess.Core.Enums;
using MediatR;

namespace chess.Application.Requests.EngineRequests.EndEngineGame;

/// <summary>
/// Request for ending games with engine
/// </summary>
public class EndEngineGameRequest : IRequest {

    /// <summary>
    /// Game id to end
    /// </summary>
    public Guid GameId { get; set; }

    /// <summary>
    /// Color of loser player (null if draw)
    /// </summary>
    public PieceColor? LoserColor { get; set; }

    /// <summary>
    /// Is reason of end a checkmate
    /// </summary>
    public bool IsCheckMate { get; set; }
}
