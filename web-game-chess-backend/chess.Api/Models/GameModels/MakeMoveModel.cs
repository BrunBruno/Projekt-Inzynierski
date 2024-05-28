
namespace chess.Api.Models.GameModels;

public class MakeMoveModel {
    public Guid GameId { get; set; }
    public required string Position { get; set; }
    public required string Move { get; set; }
    public required  string OldCoor { get; set; }
    public required string NewCoor { get; set; }
    public string? CapturedPiece { get; set; }
    public string? EnPassant{ get; set; }
    public bool Wkm { get; set; }
    public  bool Wsrm { get; set; }
    public bool Wlrm { get; set; }
    public bool Bkm { get; set; }
    public bool Bsrm { get; set; }
    public bool Blrm { get; set; }
}
