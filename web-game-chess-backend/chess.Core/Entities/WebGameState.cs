
#pragma warning disable CS8618
using chess.Core.Abstraction;

namespace chess.Core.Entities;

/// <summary>
/// States of game (belongs only to one game)
/// </summary>
public class WebGameState : GameState {

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
    public WebGame Game { get; set; }
}
