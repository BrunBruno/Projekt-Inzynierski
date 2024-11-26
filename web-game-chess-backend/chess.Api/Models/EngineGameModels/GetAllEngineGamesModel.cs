
using chess.Application.Pagination;

namespace chess.Api.Models.EngineGameModels;

public class GetAllEngineGamesModel : PagedRequest {
    public List<bool?>? ResultFilters { get; set; }
}
