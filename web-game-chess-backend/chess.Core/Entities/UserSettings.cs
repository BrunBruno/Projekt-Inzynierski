
using chess.Core.Enums;

namespace chess.Core.Entities;
#pragma warning disable CS8618

/// <summary>
/// 
/// </summary>
public class UserSettings {

    /// <summary>
    /// Id
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// Game apearance settings
    /// </summary>

    public AppearanceOfPieces AppearanceOfPieces { get; set; } = AppearanceOfPieces.Standard;
    public AppearanceOfBoard AppearanceOfBoard { get; set; } = AppearanceOfBoard.Rounded;
    public AppearanceOfGamePage AppearanceOfGamePage { get; set; } = AppearanceOfGamePage.Full;

    public Guid UserId { get; set; }
    public User User { get; set; }
}
