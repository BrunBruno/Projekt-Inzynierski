
namespace chess.Core.Entities;

public class GameState {
    public Guid Id { get; set; }
    public string? EnPassant { get; set; } = null;
    public bool CanWhiteKingCastle { get; set; } = true;
    public bool CanWhiteShortRookCastle { get; set; } = true;
    public bool CanWhiteLongRookCastle { get; set; } = true;
    public bool CanBlackKingCastle { get; set; } = true;
    public bool CanBlackShortRookCastle { get; set; } = true;
    public bool CanBlackLongRookCastle { get; set; } = true;
}
