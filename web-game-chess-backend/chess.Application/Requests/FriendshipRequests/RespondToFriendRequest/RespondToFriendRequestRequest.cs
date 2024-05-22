
using MediatR;

namespace chess.Application.Requests.FriendshipRequests.RespondToFriendRequest;

public class RespondToFriendRequestRequest : IRequest {
    public Guid FriendshipId { get; set; }
    public bool IsAccepted { get; set; }
}
