
using chess.Application.Pagination;
using chess.Core.Enums;
using MediatR;

namespace chess.Application.Requests.FriendshipRequests.GetFriendshipRanking;

public class GetFriendshipRankingRequest: PagedRequest, IRequest<PagedResult<GetFriendshipRankingDto>> {

    public TimingTypes Type { get; set; }
}
