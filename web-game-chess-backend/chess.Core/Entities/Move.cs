
namespace chess.Core.Entities;
#pragma warning disable CS8618

public class Move {
    public Guid Id { get; set; }
    public string DoneMove { get; set; }
    public string OldCoordinates { get; set; }
    public string NewCoordinates { get; set; }
    public string Position { get; set; }
    public int Turn { get; set; }
    public double WhiteTime { get; set; }
    public double BlackTime {  get; set; }
    public Guid GameId { get; set; }
    public Game Game {  get; set; }
}
