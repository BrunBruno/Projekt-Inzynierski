
using MediatR;

namespace chess.Application.Requests.UserRequests.VerifyEmail;
#pragma warning disable CS8618

public class VerifyEmailRequest : IRequest {
    public string Code { get; set; }
}

