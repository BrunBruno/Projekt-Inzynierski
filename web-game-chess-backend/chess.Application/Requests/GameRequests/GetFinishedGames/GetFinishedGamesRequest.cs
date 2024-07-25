
using chess.Application.Pagination;
using chess.Core.Enums;
using MediatR;

namespace chess.Application.Requests.GameRequests.GetFinishedGames;

/// <summary>
/// Request for getting all finished games for user
/// </summary>
public class GetFinishedGamesRequest : PagedRequest, IRequest<PagedResult<GetFinishedGamesDto>> {

    /// <summary>
    /// 
    /// </summary>
    public List<TimingTypes>? TimingTypeFilters { get; set; }

    /// <summary>
    /// 
    /// </summary>
    public List <bool?>? ResultFilters { get; set; } 
}
