
namespace chess.Application.Requests.UserRequests.LogIn;

/// <summary>
/// DTO returned after signing in.
/// </summary>
public class LogInUserDto {

    /// <summary>
    /// Jwt token
    /// </summary>
    public string? Token { get; set; }
}
