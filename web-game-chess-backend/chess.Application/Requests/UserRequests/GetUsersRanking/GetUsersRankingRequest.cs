
using chess.Application.Pagination;
using chess.Core.Enums;
using MediatR;

namespace chess.Application.Requests.UserRequests.GetUsersRanking;

/// <summary>
/// Request for getting global user ranking
/// </summary>
public class GetUsersRankingRequest : PagedRequest, IRequest<PagedResult<GetUsersRankingDto>> {

    /// <summary>
    /// Selected timing type
    /// </summary>
    public TimingTypes Type { get; set; }
}
