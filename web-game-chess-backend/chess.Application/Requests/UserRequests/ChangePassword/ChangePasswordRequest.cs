
using MediatR;

namespace chess.Application.Requests.UserRequests.ChangePassword;

/// <summary>
/// Request for updating user password
/// </summary>
public class ChangePasswordRequest : IRequest {

    /// <summary>
    /// previous password
    /// </summary>
    public required string OldPassword { get; set; }

    /// <summary>
    /// new password
    /// </summary>
    public required string NewPassword { get; set; }

    /// <summary>
    /// new password confirmation
    /// </summary>
    public required string ConfirmPassword { get; set; }
}
