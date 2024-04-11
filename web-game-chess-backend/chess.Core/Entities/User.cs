
using chess.Core.Enums;

namespace chess.Core.Entities;

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
    /// Url with user image.
    /// </summary>
    public string? ImageUrl { get; set; }

    /// <summary>
    /// Is user email verified
    /// </summary>
    public bool IsVerified { get; set; } = false;

    /// <summary>
    /// Role id
    /// </summary>
    public int RoleId { get; set; } = (int)Roles.User;

    /// <summary>
    /// User role.
    /// </summary>
    public Role Role { get; set; }

}
