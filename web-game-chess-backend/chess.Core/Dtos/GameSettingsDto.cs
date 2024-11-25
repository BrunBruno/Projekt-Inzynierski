
using chess.Core.Enums;

namespace chess.Core.Dtos;

/// <summary>
/// Gameplay settings dto
/// </summary>
public class GameSettingsDto {

    /// <summary>
    /// Piece appearance
    /// </summary>
    public AppearanceOfPieces AppearanceOfPieces { get; set; }

    /// <summary>
    /// Board appearance
    /// </summary>
    public AppearanceOfBoard AppearanceOfBoard { get; set; }

    /// <summary>
    /// Page appearance
    /// </summary>
    public AppearanceOfGamePage AppearanceOfGamePage { get; set; }

    /// <summary>
    /// If cheats in engine games are allowed 
    /// </summary>
    public bool AllowCheats { get; set; }
}
