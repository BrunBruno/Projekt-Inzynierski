
using chess.Core.Abstraction;
using chess.Core.Enums;

#pragma warning disable CS8618
namespace chess.Core.Entities;

/// <summary>
/// Online game entity
/// </summary>
public class WebGame : Game {

    /// <summary>
    /// Id pk
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// Determines if game is public or private
    /// </summary>
    public bool IsPrivate { get; set; } = false;

    /// <summary>
    /// Will the game count for user elo
    /// </summary>
    public bool IsRanked { get; set; } = true;

    /// <summary>
    /// Timing type for game
    /// </summary>
    public TimingTypes TimingType { get; set; }

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
    /// White player
    /// </summary>
    public Guid WhitePlayerId { get; set; }
    public WebGamePlayer WhitePlayer { get; set; }
    

    /// <summary>
    /// Id of player playing as black
    /// Black player
    /// </summary>
    public Guid BlackPlayerId { get; set; }
    public WebGamePlayer BlackPlayer { get; set; }


    /// <summary>
    /// Time and increment that each player have for moves
    /// </summary>
    public Guid GameTimingId { get; set; }
    public WebGameTiming GameTiming { get; set; }


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
