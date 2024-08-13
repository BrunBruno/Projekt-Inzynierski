
using chess.Application.Pagination;
using chess.Core.Enums;
using MediatR;

namespace chess.Application.Requests.GameRequests.GetAllFinishedGames;

/// <summary>
/// Request for getting all finished games for user
/// </summary>
public class GetAllFinishedGamesRequest : PagedRequest, IRequest<PagedResult<GetAllFinishedGamesDto>> {

    /// <summary>
    /// 
    /// </summary>
    public List<TimingTypes>? TimingTypeFilters { get; set; }

    /// <summary>
    /// 
    /// </summary>
    public List <bool?>? ResultFilters { get; set; } 
}
