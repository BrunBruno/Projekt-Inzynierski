
using MediatR;

namespace chess.Application.Requests.UserRequests.GetOtherUser;

public class GetOtherUserRequest : IRequest<GetOtherUserDto> {
    public Guid UserId { get; set; }
}
