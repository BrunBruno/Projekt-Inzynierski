
using MediatR;

namespace chess.Application.Requests.UserRequests.GetUser;

/// <summary>
/// Request for getting user info
/// </summary>
public class GetUserRequest : IRequest<GetUserDto> { 
}
