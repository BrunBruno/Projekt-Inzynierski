
using chess.Core.Abstraction;
using chess.Core.Enums;

#pragma warning disable CS8618
namespace chess.Core.Entities;

/// <summary>
/// Online game entity
/// </summary>
public class WebGame : Game {

    /// <summary>
    /// Id
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// Determines if game is public or private
    /// </summary>
    public bool IsPrivate { get; set; } = false;

    /// <summary>
    /// Reason why game has ended
    /// </summary>
    public GameEndReason? EndGameType { get; set; } = null;

    /// <summary>
    /// Elo gained or lost after game has ended
    /// </summary>
    public int EloGain { get; set; }

    /// <summary>
    /// Id of player playing as white
    /// </summary>
    public Guid WhitePlayerId { get; set; }

    /// <summary>
    /// Is white player added to game
    /// </summary>
    public required bool WhitePlayerRegistered { get; set; }

    /// <summary>
    /// White player
    /// </summary>
    public WebGamePlayer WhitePlayer { get; set; }
    
    /// <summary>
    /// Id of player playing as black
    /// </summary>
    public Guid BlackPlayerId { get; set; }

    /// <summary>
    /// Is black player added to game
    /// </summary>
    public required bool BlackPlayerRegistered { get; set; }

    /// <summary>
    /// Black player
    /// </summary>
    public WebGamePlayer BlackPlayer { get; set; }

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
    public WebGameState CurrentState { get; set; }

    /// <summary>
    /// List of moves that was done during game
    /// </summary>
    public List<WebGameMove> Moves { get; set; }

    /// <summary>
    /// List of auto messages for game
    /// </summary>
    public List<WebGameMessage> Messages { get; set; }
}
