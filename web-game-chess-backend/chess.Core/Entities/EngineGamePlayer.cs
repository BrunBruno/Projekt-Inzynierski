
using chess.Core.Abstraction;

#pragma warning disable CS8618 
namespace chess.Core.Entities;

/// <summary>
/// Player for engine game
/// </summary>
public class EngineGamePlayer : Player {

    /// <summary>
    /// Id
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// User id
    /// </summary>
    public Guid UserId { get; set; }

    /// <summary>
    /// User for which player belong to
    /// </summary>
    public User User { get; set; }

    /// <summary>
    /// Game id
    /// </summary>
    public Guid GameId { get; set; }

    /// <summary>
    /// Game in which player is playing as white
    /// null if playing as black
    /// </summary>
    public EngineGame Game { get; set; }
}
