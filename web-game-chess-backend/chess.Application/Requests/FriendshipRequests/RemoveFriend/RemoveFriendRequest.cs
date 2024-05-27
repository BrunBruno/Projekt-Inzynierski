
using MediatR;

namespace chess.Application.Requests.FriendshipRequests.RemoveFriend;

public class RemoveFriendRequest : IRequest {
    public Guid FriendshipId { get; set; }
}
