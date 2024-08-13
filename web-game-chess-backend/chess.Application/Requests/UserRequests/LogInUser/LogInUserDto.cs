
namespace chess.Application.Requests.UserRequests.LogInUser;

/// <summary>
/// DTO returned after signing in.
/// </summary>
public class LogInUserDto {

    /// <summary>
    /// Jwt token
    /// </summary>
    public string? Token { get; set; }
}
