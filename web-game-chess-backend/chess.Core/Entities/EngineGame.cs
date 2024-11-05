
using chess.Core.Abstraction;

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
    public bool? IWinner { get; set; }

    /// <summary>
    /// Current player id
    /// </summary>
    public Guid PlayerId { get; set; }

    /// <summary>
    /// Current player
    /// </summary>
    public EngineGamePlayer Player { get; set; }

    /// <summary>
    /// 
    /// </summary>
    public EngineGameState CurrentState { get; set; }

    /// <summary>
    /// List of game moves
    /// </summary>
    public List<EngineGameMove> Moves { get; set; }

    /// <summary>
    /// 
    /// </summary>
    public List<EngineGameMessage> Messages { get; set; }
}
