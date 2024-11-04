
namespace chess.Api.Models.WebGameModels;

public class MakeWebGameMoveModel {
    public Guid GameId { get; set; }
    public required string Position { get; set; }
    public required string Move { get; set; }
    public required string FenMove { get; set; }
    public required string OldCoor { get; set; }
    public required string NewCoor { get; set; }
    public string? CapturedPiece { get; set; }
    public string? EnPassant { get; set; }
    public bool WhitekingMoved { get; set; }
    public bool WhiteShortRookMoved { get; set; }
    public bool WhiteLongRookMoved { get; set; }
    public bool BlackKingMoved { get; set; }
    public bool BlackShortRookMoved { get; set; }
    public bool BlackLongRookMoved { get; set; }
}
