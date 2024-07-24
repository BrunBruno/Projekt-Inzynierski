
using MediatR;

namespace chess.Application.Requests.FriendshipRequests.InviteFriend;

/// <summary>
/// Request to create new friendships
/// </summary>
public class InviteFriendRequest : IRequest {

    /// <summary>
    /// Id of user to send friend invitation
    /// </summary>
    public Guid ReceiverId { get; set; }
}
