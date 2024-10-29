
using chess.Core.Abstraction;

#pragma warning disable CS8618
namespace chess.Core.Entities;

/// <summary>
/// States for engine game
/// </summary>
public class EngineGameState : GameState {

    /// <summary>
    /// Id
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// Game id
    /// </summary>
    public Guid GameId { get; set; }

    /// <summary>
    /// Game for which states belong to
    /// </summary>
    public EngineGame Game { get; set; }
}

