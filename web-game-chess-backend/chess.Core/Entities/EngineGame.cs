
using chess.Core.Abstraction;

#pragma warning disable CS8618
namespace chess.Core.Entities;

/// <summary>
/// Games played against chess engine
/// </summary>
public class EngineGame : Game {

    /// <summary>
    /// Id pk
    /// </summary>
    public Guid Id { get; set; }


    /// <summary>
    /// Level of engine depth
    /// </summary>
    public int EngineLevel { get; set; } = 1;


    /// <summary>
    /// Current player
    /// </summary>
    public Guid PlayerId { get; set; }
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
