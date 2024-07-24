
namespace chess.Core.Dtos;

/// <summary>
/// General user dto
/// </summary>
public class UserDto {

    /// <summary>
    /// Username
    /// </summary>
    public required string Username { get; set; }

    /// <summary>
    /// Full name of user
    /// </summary>
    public string? Name { get; set; }

    /// <summary>
    /// Users profile picture
    /// </summary>
    public string? ImageUrl { get; set; }

    /// <summary>
    /// Country where user registered account
    /// </summary>
    public required string Country { get; set; }
}
