
using chess.Core.Enums;

namespace chess.Api.Models.UserModels;

public class UpdateUserSettingsModel {
    public AppearanceOfBoard? AppearanceOfBoard { get; set; }
    public AppearanceOfGamePage? AppearanceOfGamePage { get; set; }
    public AppearanceOfPieces? AppearanceOfPieces { get; set; }
}
