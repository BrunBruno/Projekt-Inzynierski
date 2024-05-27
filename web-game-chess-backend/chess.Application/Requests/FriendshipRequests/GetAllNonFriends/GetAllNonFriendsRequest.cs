
using chess.Application.Pagination;
using MediatR;

namespace chess.Application.Requests.FriendshipRequests.GetAllNonFriends;

public class GetAllNonFriendsRequest : IRequest<PagedResult<GetAllNonFriendsDto>> {
    public string? Username { get; set; }
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
}
