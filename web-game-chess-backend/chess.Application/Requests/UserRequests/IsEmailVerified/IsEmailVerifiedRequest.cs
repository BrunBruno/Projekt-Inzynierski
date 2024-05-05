
using MediatR;

namespace chess.Application.Requests.UserRequests.IsEmailVerified;

/// <summary>
/// Request for checking if user emial is verfied 
/// </summary>
public class IsEmailVerifiedRequest : IRequest<IsEmailVerifiedDto>  {
}
