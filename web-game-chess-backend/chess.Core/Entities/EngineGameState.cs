
using chess.Core.Abstraction;

#pragma warning disable CS8618
namespace chess.Core.Entities;

/// <summary>
/// States for engine game
/// </summary>
public class EngineGameState : GameState {

    /// <summary>
    /// Id pk
    /// </summary>
    public Guid Id { get; set; }


    /// <summary>
    /// Game for which states belong to
    /// </summary>
    public Guid GameId { get; set; }
    public EngineGame Game { get; set; }
}

