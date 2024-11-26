
using chess.Core.Enums;
using MediatR;

namespace chess.Application.Requests.UserRequests.UpdateUserSettings;

public class UpdateUserSettingsRequest : IRequest {
    public AppearanceOfBoard? AppearanceOfBoard { get; set; }
    public AppearanceOfGamePage? AppearanceOfGamePage { get; set; }
    public AppearanceOfPieces? AppearanceOfPieces { get; set; }
}
