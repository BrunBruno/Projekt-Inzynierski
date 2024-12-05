
using chess.Application.Pagination;
using MediatR;

namespace chess.Application.Requests.EngineRequests.GetAllEngineGames;

/// <summary>
/// Request for getting all finished game with engine
/// </summary>
public class GetAllEngineGamesRequest : PagedRequest, IRequest<PagedResult<GetAllEngineGamesDto>> {

    /// <summary>
    /// Filters by result of the game
    /// </summary>
    public List<bool?>? ResultFilters { get; set; }
}
