
namespace chess.Api.Models.UserModels;

public class ResetPasswordModel {
    public required string Code { get; set; }
    public required string NewPassword { get; set; }
    public required string PasswordConfirm { get; set; }
}
