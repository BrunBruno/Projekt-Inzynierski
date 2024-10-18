
namespace chess.Api.Models.UserModels;

public class ResetPasswordModel {
    public required string Email { get; set; }
    public required string Code { get; set; }
    public required string NewPassword { get; set; }
    public required string ConfirmPassword { get; set; }
}
