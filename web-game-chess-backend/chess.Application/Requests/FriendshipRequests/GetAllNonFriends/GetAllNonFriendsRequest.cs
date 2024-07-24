
using chess.Application.Pagination;
using MediatR;

namespace chess.Application.Requests.FriendshipRequests.GetAllNonFriends;


/// <summary>
/// Request to get all users that have not established relationship with currrent user
/// </summary>
public class GetAllNonFriendsRequest : PagedRequest, IRequest<PagedResult<GetAllNonFriendsDto>> {

    /// <summary>
    /// Possibly proevided username
    /// To filter throught users if not null
    /// </summary>
    public string? Username { get; set; }
}
