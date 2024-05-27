
using MediatR;

namespace chess.Application.Requests.FriendshipRequests.InviteFriend;

public class InviteFriendRequest : IRequest {

    public Guid ReceiverId { get; set; }
}
