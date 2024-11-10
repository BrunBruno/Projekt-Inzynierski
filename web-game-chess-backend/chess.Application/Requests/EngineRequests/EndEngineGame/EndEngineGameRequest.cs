
using chess.Core.Enums;
using MediatR;

namespace chess.Application.Requests.EngineRequests.EndEngineGame;

public class EndEngineGameRequest : IRequest<EndEngineGameDto> {

    /// <summary>
    /// Game id to end
    /// </summary>
    public Guid GameId { get; set; }

    /// <summary>
    /// Color of loser player (null if draw)
    /// </summary>
    public PieceColor? LoserColor { get; set; }
}
