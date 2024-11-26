
using chess.Core.Abstraction;

#pragma warning disable CS8618
namespace chess.Core.Entities;

/// <summary>
/// Moves for engine game
/// </summary>
public class EngineGameMove : Move {

    /// <summary>
    /// Id pk
    /// </summary>
    public Guid Id { get; set; }


    /// <summary>
    /// Game for which moves belong to
    /// </summary>
    public Guid GameId { get; set; }
    public EngineGame Game { get; set; }
}
