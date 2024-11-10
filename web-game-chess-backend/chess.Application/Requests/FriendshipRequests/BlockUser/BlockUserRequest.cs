
using MediatR;

namespace chess.Application.Requests.FriendshipRequests.BlockUser;

/// <summary>
/// Request to block unknown users
/// </summary>
public class BlockUserRequest : IRequest {

    /// <summary>
    /// User id to block
    /// </summary>
    public Guid UserId { get; set; }
}
