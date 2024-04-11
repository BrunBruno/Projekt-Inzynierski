
using MediatR;

namespace chess.Application.Requests.UserRequests.VerifyEmail;
public class VerifyEmailRequest : IRequest {
    public string Code { get; set; }
}

