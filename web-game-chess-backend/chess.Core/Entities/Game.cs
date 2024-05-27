
using chess.Core.Enums;

namespace chess.Core.Entities;
#pragma warning disable CS8618

public class Game {

    /// <summary>
    /// Id
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// Current position of game
    /// </summary>
    public string Position { get; set; } = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";

    /// <summary>
    /// Bool flag if game has ended
    /// </summary>
    public bool HasEnded { get; set; } = false;

    /// <summary>
    /// Determines if game is public or private
    /// </summary>
    public bool IsPrivate { get; set; } = false;

    /// <summary>
    /// Date of creation
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Turn of game
    /// </summary>
    public int Turn { get; set; } = 0;

    /// <summary>
    /// Round of game (both players moved)
    /// </summary>
    public int Round { get; set; } = 1;

    /// <summary>
    /// Winner color (null is draw)
    /// </summary>
    public Colors? WinnerColor { get; set; }  = null;

    /// <summary>
    /// Timing for game
    /// </summary>
    public TimingTypes TimingType { get; set; }

    /// <summary>
    /// Reason why game has ended
    /// </summary>
    public EndGameTypes? EndGameType { get; set; } = null;

    /// <summary>
    /// Id of player playing as white
    /// </summary>
    public Guid WhitePlayerId { get; set; }

    /// <summary>
    /// White player
    /// </summary>
    public Player WhitePlayer { get; set; }
    
    /// <summary>
    /// Id of player playing as black
    /// </summary>
    public Guid BlackPlayerId { get; set; }

    /// <summary>
    /// Black player
    /// </summary>
    public Player BlackPlayer { get; set; }

    /// <summary>
    /// Timing id for game
    /// </summary>
    public Guid GameTimingId { get; set; }

    /// <summary>
    /// Time and increment that each player have for moves
    /// </summary>
    public GameTiming GameTiming { get; set; }

    /// <summary>
    /// States related to game
    /// </summary>
    public GameState GameState { get; set; }

    /// <summary>
    /// List of moves that was done during game
    /// </summary>
    public List<Move> Moves { get; set; }

}
