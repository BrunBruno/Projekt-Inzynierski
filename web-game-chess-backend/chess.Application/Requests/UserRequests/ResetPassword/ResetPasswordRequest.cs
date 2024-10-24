
using MediatR;

namespace chess.Application.Requests.UserRequests.ResetPassword;

/// <summary>
/// request for reset users password
/// </summary>
public class ResetPasswordRequest : IRequest {

    /// <summary>
    /// User email
    /// </summary>
    public required string Email { get; set; }

    /// <summary>
    /// Password reset verification code
    /// </summary>
    public required string Code { get; set; }

    /// <summary>
    /// New provided password
    /// </summary>
    public required string NewPassword { get; set; }

    /// <summary>
    /// Password confirmation
    /// </summary>
    public required string ConfirmPassword { get; set; }
}
