
using chess.Application.Pagination;
using chess.Core.Enums;
using MediatR;

namespace chess.Application.Requests.FriendshipRequests.GetFriendshipRanking;

/// <summary>
/// Request for getting user ranking among friends
/// </summary>
public class GetFriendshipRankingRequest: PagedRequest, IRequest<PagedResult<GetFriendshipRankingDto>> {

    /// <summary>
    /// Selected timing type
    /// </summary>
    public TimingTypes Type { get; set; }
}
