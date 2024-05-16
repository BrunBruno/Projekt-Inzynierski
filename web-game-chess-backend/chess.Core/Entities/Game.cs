
namespace chess.Core.Entities;
#pragma warning disable CS8618

public class Game {
    public Guid Id { get; set; }
    public string Position { get; set; } = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";
    public bool HasEnded { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public int Turn { get; set; } = 0;
    public int Round { get; set; } = 1;

    public Guid WhitePlayerId { get; set; }
    public Player WhitePlayer { get; set; }
    
    public Guid BlackPlayerId { get; set; }
    public Player BlackPlayer { get; set; }

    public Guid GameTimingId { get; set; }
    public GameTiming GameTiming { get; set; }

    public Guid GameStateId { get; set; }
    public GameState GameState { get; set; }

    public List<Move> Moves { get; set; }

}
