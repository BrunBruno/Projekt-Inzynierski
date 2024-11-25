
using MediatR;

namespace chess.Application.Requests.EngineRequests.UpdateEngineSettings;

/// <summary>
/// Request for changing user engine settings
/// </summary>
public class UpdateEngineSettingsRequest : IRequest {

    /// <summary>
    /// If cheats are allowed during games
    /// </summary>
    public bool? AllowCheats { get; set; }
}
