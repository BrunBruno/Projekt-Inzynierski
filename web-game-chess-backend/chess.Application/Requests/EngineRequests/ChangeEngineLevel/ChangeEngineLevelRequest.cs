
using MediatR;

namespace chess.Application.Requests.EngineRequests.ChangeEngineLevel;

/// <summary>
/// Request for updating engine level for current game
/// </summary>
public class ChangeEngineLevelRequest : IRequest {

    /// <summary>
    /// Current game id
    /// </summary>
    public Guid GameId { get; set; }

    /// <summary>
    /// New level
    /// </summary>
    public int Level { get; set; }
}
