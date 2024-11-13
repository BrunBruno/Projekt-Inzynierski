
namespace chess.Api.Models.UserModels;

public class ChangePasswordModel {
    public required string OldPassword { get; set; }
    public required string NewPassword { get; set; }
    public required string ConfirmPassword { get; set; }
}
