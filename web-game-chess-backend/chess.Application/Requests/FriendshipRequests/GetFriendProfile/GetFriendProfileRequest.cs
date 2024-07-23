
using MediatR;

namespace chess.Application.Requests.FriendshipRequests.GetFriendProfile;

public class GetFriendProfileRequest : IRequest<GetFriendProfileDto> {
    public Guid FriendshipId { get; set; }
}
