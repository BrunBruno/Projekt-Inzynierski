
using chess.Application.Pagination;
using chess.Core.Enums;

namespace chess.Api.Models.WebGameModels;

public class GetAllActiveWebGamesModel : PagedRequest {
    public List<TimingTypes>? TimingTypeFilters { get; set; }
}
