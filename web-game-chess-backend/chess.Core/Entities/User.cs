
using chess.Core.Enums;

#pragma warning disable CS8618
namespace chess.Core.Entities;

/// <summary>
/// User entity
/// </summary>
public class User {

    /// <summary>
    /// Id PK
    /// </summary>
    public Guid Id { get; set; }


    /// <summary>
    /// Is user email verified
    /// </summary>
    public bool IsVerified { get; set; } = false;

    /// <summary>
    /// Email address
    /// </summary>
    public required string Email { get; set; }

    /// <summary>
    /// Unique username
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
    /// Day on which user joined
    /// </summary>
    public DateTime JoinDate { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Country where user signed up
    /// </summary>
    public string Country { get; set; } = string.Empty;

    /// <summary>
    /// Short description/biography of user
    /// </summary>
    public string? Bio { get; set; }

    /// <summary>
    /// Determines if user profile is private or not
    /// </summary>
    public bool IsPrivate { get; set; } = false;


    /// <summary>
    /// User role
    /// </summary>
    public int RoleId { get; set; } = (int)Roles.User;
    public Role Role { get; set; }


    /// <summary>
    /// User profile picture adn background image
    /// </summary>
    public UserProfileImage? Image { get; set; } = null;
    public UserBackgroundImage? Background { get; set; } = null;


    /// <summary>
    /// Score points of player for different types
    /// </summary>
    public UserElo Elo { get; set; }


    /// <summary>
    /// Statistics for users games
    /// </summary>
    public UserStats Stats { get; set; }


    /// <summary>
    /// User account and game preferences settings
    /// </summary>
    public UserSettings Settings { get; set; }


    /// <summary>
    /// Players for each online game
    /// </summary>
    public List<WebGamePlayer> Players { get; set; }


    /// <summary>
    /// Players for each offline game
    /// </summary>
    public List<EngineGamePlayer> EngineGamePlayers { get; set; }


    /// <summary>
    /// List of friendships that user requested and received
    /// </summary>
    public List<Friendship> RequestedFriendships { get; set; }
    public List<Friendship> ReceivedFriendships { get; set; }
}
