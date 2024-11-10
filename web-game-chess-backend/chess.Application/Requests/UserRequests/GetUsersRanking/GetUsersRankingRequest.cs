
using chess.Application.Pagination;
using chess.Core.Enums;
using MediatR;

namespace chess.Application.Requests.UserRequests.GetUsersRanking;

public class GetUsersRankingRequest : PagedRequest, IRequest<PagedResult<GetUsersRankingDto>> {
    public TimingTypes Type { get; set; }
}
