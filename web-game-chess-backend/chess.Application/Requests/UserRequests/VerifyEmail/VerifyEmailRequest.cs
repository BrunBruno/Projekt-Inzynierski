
using MediatR;

namespace chess.Application.Requests.UserRequests.VerifyEmail;

/// <summary>
/// Request for email verification
/// </summary>
public class VerifyEmailRequest : IRequest {

    /// <summary>
    /// Verification code
    /// </summary>
    public required string Code { get; set; }
}

