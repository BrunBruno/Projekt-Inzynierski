
using chess.Application.Pagination;
using chess.Core.Enums;
using MediatR;

namespace chess.Application.Requests.WebGameRequests.GetAllFinishedGames;

/// <summary>
/// Request for getting all finished games for user
/// </summary>
public class GetAllFinishedGamesRequest : PagedRequest, IRequest<PagedResult<GetAllFinishedGamesDto>> {

    /// <summary>
    /// Filters by game timing type
    /// </summary>
    public List<TimingTypes>? TimingTypeFilters { get; set; }

    /// <summary>
    /// Filters by result of the game
    /// </summary>
    public List <bool?>? ResultFilters { get; set; } 
}
