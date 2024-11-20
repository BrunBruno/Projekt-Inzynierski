
using chess.Application.Pagination;
using MediatR;

namespace chess.Application.Requests.EngineRequests.GetAllEngineGames;

public class GetAllEngineGamesRequest : PagedRequest, IRequest<PagedResult<GetAllEngineGamesDto>> {

    /// <summary>
    /// Filters by result of the game
    /// </summary>
    public List<bool?>? ResultFilters { get; set; }
}
