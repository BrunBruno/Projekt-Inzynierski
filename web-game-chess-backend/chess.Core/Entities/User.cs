
using chess.Core.Enums;

namespace chess.Core.Entities;
#pragma warning disable CS8618

/// <summary>
/// User entity
/// </summary>
public class User {
    /// <summary>
    /// Id
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// Email address
    /// </summary>
    public required string Email { get; set; }

    /// <summary>
    /// Username
    /// </summary>
    public required string Username { get; set; }

    /// <summary>
    /// Full user name
    /// </summary>
    public string? Name { get; set; }

    /// <summary>
    /// Hashed password
    /// </summary>
    public string PasswordHash { get; set; }

    /// <summary>
    /// Day on which user joied
    /// </summary>
    public DateTime JoinDate { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Url with user image.
    /// </summary>
    public string? ImageUrl { get; set; }

    /// <summary>
    /// Is user email verified
    /// </summary>
    public bool IsVerified { get; set; } = false;

    /// <summary>
    /// Score of user
    /// </summary>
    public int Elo { get; set; } = 1000;

    /// <summary>
    /// Role id
    /// </summary>
    public int RoleId { get; set; } = (int)Roles.User;

    /// <summary>
    /// User role
    /// </summary>
    public Role Role { get; set; }

    /// <summary>
    /// Players for each game that user played
    /// </summary>
    public List<Player> Players { get; set; }

    /// <summary>
    /// List of friendships that user requested
    /// </summary>
    public List<Friendship> RequestedFriendships { get; set; }

    /// <summary>
    /// List of friendships that user received
    /// </summary>
    public List<Friendship> ReceivedFriendships { get; set; }

}
