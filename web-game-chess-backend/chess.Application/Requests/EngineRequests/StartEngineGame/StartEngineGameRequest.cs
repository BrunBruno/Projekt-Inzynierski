
using chess.Core.Enums;
using chess.Core.Models;
using MediatR;

namespace chess.Application.Requests.EngineRequests.StartEngineGame;

/// <summary>
/// Request for creating and staring new game with engine
/// </summary>
public class StartEngineGameRequest : TimingTypeModel, IRequest<StartEngineGameDto> {

    public new TimingTypes? Type { get; set; }
    public new int? Minutes { get; set; }
    public new int? Increment { get; set; }

    /// <summary>
    /// If player enables undos
    /// </summary>
    public bool AllowUndo { get; set; }

    /// <summary>
    /// Engine level
    /// </summary>

    public int EngineLevel { get; set; }
}
