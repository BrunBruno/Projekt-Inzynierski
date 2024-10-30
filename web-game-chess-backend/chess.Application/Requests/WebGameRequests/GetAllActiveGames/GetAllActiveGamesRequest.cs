
using chess.Application.Pagination;
using chess.Core.Enums;
using MediatR;

namespace chess.Application.Requests.WebGameRequests.GetAllActiveGames;

/// <summary>
/// Request to get all ongoing games
/// </summary>
public class GetAllActiveGamesRequest : PagedRequest, IRequest<PagedResult<GetAllActiveGamesDto>> {

    /// <summary>
    /// Filters by game timing type
    /// </summary>
    public List<TimingTypes>? TimingTypeFilters { get; set; }
}
