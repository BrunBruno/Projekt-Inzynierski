
namespace chess.Application.Requests.UserRequests.GetUser;

/// <summary>
/// DTO for user info
/// </summary>
public class GetUserDto {

    /// <summary>
    /// User email
    /// </summary>
    public required string Email { get; set; }

    /// <summary>
    /// User nickname
    /// </summary>
    public required string UserName { get; set; }

    /// <summary>
    /// Full name of user
    /// </summary>
    public string? FullName { get; set; }

    /// <summary>
    /// User avatar
    /// </summary>
    public string? ImageUrl { get; set; }
}
