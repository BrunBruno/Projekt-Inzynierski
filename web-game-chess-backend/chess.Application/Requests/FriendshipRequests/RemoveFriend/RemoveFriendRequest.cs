
using MediatR;

namespace chess.Application.Requests.FriendshipRequests.RemoveFriend;

/// <summary>
/// Request to remove existing friendship
/// Also used to unblock blocked users by removing relations with status blocked
/// </summary>
public class RemoveFriendRequest : IRequest {

    /// <summary>
    /// Id of friendship to remove
    /// </summary>
    public Guid FriendshipId { get; set; }
}
