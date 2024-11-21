
using chess.Core.Abstraction;

#pragma warning disable CS8618 
namespace chess.Core.Entities;

/// <summary>
/// Player for engine game
/// </summary>
public class EngineGamePlayer : Player {

    /// <summary>
    /// Id pk
    /// </summary>
    public Guid Id { get; set; }


    /// <summary>
    /// Elo points for engine games
    /// </summary>
    public int Elo { get; set; }


    /// <summary>
    /// User for which player belong to
    /// </summary>
    public Guid UserId { get; set; }
    public User User { get; set; }


    /// <summary>
    /// Game for which user is player
    /// </summary>
    public Guid GameId { get; set; }
    public EngineGame Game { get; set; }
}
