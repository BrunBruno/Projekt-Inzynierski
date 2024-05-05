
namespace chess.Api.Models.UserModels;

/// <summary>
/// PUT verify-email model
/// </summary>
public class VerifyEmailModel {
    public  required string Code { get; set; }
}
