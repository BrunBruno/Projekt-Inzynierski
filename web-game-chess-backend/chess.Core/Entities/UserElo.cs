
namespace chess.Core.Entities;
#pragma warning disable CS8618

/// <summary>
/// Elo entity 
/// One to one with each user
/// </summary>
public class UserElo {

    /// <summary>
    /// Id pk
    /// </summary>
    public Guid Id { get; set; }


    /// <summary>
    /// Ele points for all timing types
    /// Starts at 1000
    /// </summary>
    public int Bullet { get; set; } = 1000;
    public int Blitz {  get; set; } = 1000;
    public int Rapid { get; set; } = 1000;
    public int Classic { get; set; } = 1000;
    public int Daily { get; set; } = 1000;

    /// <summary>
    /// Elo for games with engine
    /// </summary>
    public int Engine { get; set; } = 1000;


    /// <summary>
    /// User to which elo belongs to
    /// </summary>
    public Guid UserId { get; set; }
    public User User { get; set; }
}
