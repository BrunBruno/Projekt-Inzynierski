
namespace chess.Api.Models.UserModels;

/// <summary>
/// POST sign-up model
/// </summary>
public class RegisterUserModel {
    public required string Email { get; set; }
    public required string Username { get; set; }
    public required string Password { get; set; }
    public required string ConfirmPassword { get; set; }
}
