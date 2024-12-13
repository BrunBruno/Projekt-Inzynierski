
using chess.Core.Enums;
using MediatR;

namespace chess.Application.Requests.UserRequests.UpdateUserSettings;

/// <summary>
/// Request for updates game appearance
/// </summary>
public class UpdateUserSettingsRequest : IRequest {

    /// <summary>
    /// Game appearance settings
    /// </summary>
    public AppearanceOfBoard? AppearanceOfBoard { get; set; }
    public AppearanceOfGamePage? AppearanceOfGamePage { get; set; }
    public AppearanceOfPieces? AppearanceOfPieces { get; set; }
}
