
using MediatR;

namespace chess.Application.Requests.EngineRequests.GetEngineGame;

/// <summary>
/// Request for getting engine game
/// </summary>
public class GetEngineGameRequest : IRequest<GetEngineGameDto> {

    /// <summary>
    /// Game id
    /// </summary>
    public Guid GameId { get; set; }
}
