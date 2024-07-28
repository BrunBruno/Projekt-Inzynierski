
namespace chess.Api.Models.UserModels;

public class LogInUserModel {
    public required string EmailOrUsername { get; set; }
    public required string Password { get; set; }
}
