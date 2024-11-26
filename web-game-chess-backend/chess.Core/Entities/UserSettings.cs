
using chess.Core.Enums;

namespace chess.Core.Entities;
#pragma warning disable CS8618

/// <summary>
/// User global settings
/// One to one user
/// </summary>
public class UserSettings {

    /// <summary>
    /// Id pk
    /// </summary>
    public Guid Id { get; set; }


    /// <summary>
    /// Engine game settings
    /// </summary>
    public bool EngineGameCheats { get; set; } = false;

    /// <summary>
    /// Game appearance settings
    /// </summary>

    public AppearanceOfPieces AppearanceOfPieces { get; set; } = AppearanceOfPieces.Standard;
    public AppearanceOfBoard AppearanceOfBoard { get; set; } = AppearanceOfBoard.Rounded;
    public AppearanceOfGamePage AppearanceOfGamePage { get; set; } = AppearanceOfGamePage.Full;

    /// <summary>
    /// User for settings
    /// </summary>
    public Guid UserId { get; set; }
    public User User { get; set; }
}
