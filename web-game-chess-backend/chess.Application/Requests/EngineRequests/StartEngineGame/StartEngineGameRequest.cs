
using MediatR;

namespace chess.Application.Requests.EngineRequests.StartEngineGame;

/// <summary>
/// Request for creating and staring new game with engine
/// </summary>
public class StartEngineGameRequest : IRequest<StartEngineGameDto> {

    /// <summary>
    /// Engine level
    /// </summary>
    public int EngineLevel { get; set; }
}
