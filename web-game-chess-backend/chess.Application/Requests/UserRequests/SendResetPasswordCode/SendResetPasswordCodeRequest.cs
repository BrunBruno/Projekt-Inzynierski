
using MediatR;

namespace chess.Application.Requests.UserRequests.SendResetPasswordCode;

public class SendResetPasswordCodeRequest : IRequest {
    public required string Email { get; set; }
}
