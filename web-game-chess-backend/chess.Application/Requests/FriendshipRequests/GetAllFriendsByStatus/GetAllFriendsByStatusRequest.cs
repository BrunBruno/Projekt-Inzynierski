
using chess.Application.Pagination;
using chess.Core.Enums;
using MediatR;

namespace chess.Application.Requests.FriendshipRequests.GetAllFriendsByStatus;

public class GetAllFriendsByStatusRequest : IRequest<PagedResult<GetAllFriendsByStatusDto>> {
    public FriendshipStatus Status { get; set; }
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
}
