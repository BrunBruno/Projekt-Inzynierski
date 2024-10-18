
using MediatR;

namespace chess.Application.Requests.UserRequests.ResetPassword;

public class ResetPasswordRequest : IRequest {
    public required string Email { get; set; }
    public required string Code { get; set; }
    public required string NewPassword { get; set; }
    public required string ConfirmPassword { get; set; }
}
