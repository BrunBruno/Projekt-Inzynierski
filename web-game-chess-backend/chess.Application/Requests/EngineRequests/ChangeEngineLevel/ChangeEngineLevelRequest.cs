
using MediatR;

namespace chess.Application.Requests.EngineRequests.ChangeEngineLevel;

/// <summary>
/// 
/// </summary>
public class ChangeEngineLevelRequest : IRequest {

    /// <summary>
    /// 
    /// </summary>
    public Guid GameId { get; set; }

    /// <summary>
    /// 
    /// </summary>

    public int Level { get; set; }
}
