
using chess.Core.Abstraction;
using chess.Core.Enums;

#pragma warning disable CS8618
namespace chess.Core.Entities;

/// <summary>
/// Engine game entity
/// </summary>
public class EngineGame : Game {

    /// <summary>
    /// Id
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// Is player a winner of game, null if draw
    /// </summary>
    public bool? IsWinner { get; set; }

    /// <summary>
    /// Timing type for game
    /// </summary>
    public TimingTypes? TimingType { get; set; } = null;

    /// <summary>
    /// Level of engine depth
    /// </summary>
    public int EngineLevel { get; set; } = 1;

    /// <summary>
    /// If player enable undoing
    /// </summary>
    public bool AllowUndo { get; set; } = false;

    /// <summary>
    /// Current player id
    /// </summary>
    public Guid PlayerId { get; set; }

    /// <summary>
    /// Current player
    /// </summary>
    public EngineGamePlayer Player { get; set; }

    /// <summary>
    /// Game state
    /// </summary>
    public EngineGameState CurrentState { get; set; }

    /// <summary>
    /// List of game moves
    /// </summary>
    public List<EngineGameMove> Moves { get; set; }

    /// <summary>
    /// Game messages
    /// </summary>
    public List<EngineGameMessage> Messages { get; set; }
}
