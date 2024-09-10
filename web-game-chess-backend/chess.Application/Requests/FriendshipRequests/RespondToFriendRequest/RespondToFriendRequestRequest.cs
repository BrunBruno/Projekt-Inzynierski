
using MediatR;

namespace chess.Application.Requests.FriendshipRequests.RespondToFriendRequest;

/// <summary>
/// Request to accept or decline pending friendship requests
/// </summary>
public class RespondToFriendRequestRequest : IRequest {

    /// <summary>
    /// Friendship id
    /// </summary>
    public Guid FriendshipId { get; set; }

    /// <summary>
    /// Is invitation accepted
    /// </summary>
    public bool IsAccepted { get; set; }
}
