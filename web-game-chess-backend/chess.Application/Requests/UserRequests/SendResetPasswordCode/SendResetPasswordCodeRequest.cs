
using MediatR;

namespace chess.Application.Requests.UserRequests.SendResetPasswordCode;

/// <summary>
/// Request for sending password reset verification code
/// </summary>
public class SendResetPasswordCodeRequest : IRequest {

    /// <summary>
    /// User email to send code
    /// </summary>
    public required string Email { get; set; }
}
