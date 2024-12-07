
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
    public ImageDto? ProfilePicture { get; set; }

    /// <summary>
    /// User background image
    /// </summary>
    public ImageDto? BackgroundImage { get; set; }

    /// <summary>
    /// Country where user registered account
    /// </summary>
    public required string Country { get; set; }
}
