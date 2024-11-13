
using MediatR;

namespace chess.Application.Requests.UserRequests.ChangePassword;

public class ChangePasswordRequest : IRequest {

    public required string OldPassword { get; set; }
    public required string NewPassword { get; set; }
    public required string ConfirmPassword { get; set; }
}
