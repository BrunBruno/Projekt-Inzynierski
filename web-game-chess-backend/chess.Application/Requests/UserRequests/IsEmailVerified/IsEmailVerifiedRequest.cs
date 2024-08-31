
using MediatR;

namespace chess.Application.Requests.UserRequests.IsEmailVerified;

/// <summary>
/// Request for checking if user email is verified 
/// </summary>
public class IsEmailVerifiedRequest : IRequest<IsEmailVerifiedDto>  {
}
