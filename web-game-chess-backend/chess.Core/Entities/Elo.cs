
namespace chess.Core.Entities;
#pragma warning disable CS8618

/// <summary>
/// Elo entity 
/// One to one with each user
/// </summary>
public class Elo {

    /// <summary>
    /// Id
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// Bullet type points
    /// Starts at 1000
    /// </summary>
    public int Bullet { get; set; } = 1000;

    /// <summary>
    /// Blitz type points
    /// Starts at 1000
    /// </summary>
    public int Blitz {  get; set; } = 1000;

    /// <summary>
    /// Rapid type points
    /// Starts at 1000
    /// </summary>
    public int Rapid { get; set; } = 1000;

    /// <summary>
    /// Classic type points
    /// Starts at 1000
    /// </summary>
    public int Classic { get; set; } = 1000;

    /// <summary>
    /// Daily type points
    /// Starts at 1000
    /// </summary>
    public int Daily { get; set; } = 1000;

    /// <summary>
    /// User id
    /// </summary>
    public Guid UserId { get; set; }

    /// <summary>
    /// User to which elo belongs to
    /// </summary>
    public User User { get; set; }
}
