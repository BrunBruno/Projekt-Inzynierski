
using chess.Application.Pagination;
using chess.Core.Enums;

namespace chess.Api.Models.GameModels;

public class GetAllActiveGamesModel : PagedRequest {
    public List<TimingTypes>? TimingTypeFilters { get; set; }
}
