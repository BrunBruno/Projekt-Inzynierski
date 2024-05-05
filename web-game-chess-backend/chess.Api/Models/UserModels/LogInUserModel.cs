
namespace chess.Api.Models.UserModels;

/// <summary>
/// POST sign-in model
/// </summary>
public class LogInUserModel {
    public required string Email { get; set; }
    public required string Password { get; set; }
}
