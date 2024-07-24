
using MediatR;

namespace chess.Application.Requests.UserRequests.GetFullUser;

/// <summary>
/// Request to get full data about user
/// </summary>
public class GetFullUserRequest : IRequest<GetFullUserDto> {
}
