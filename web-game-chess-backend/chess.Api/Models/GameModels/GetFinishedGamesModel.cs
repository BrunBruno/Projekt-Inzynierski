
using chess.Core.Enums;

namespace chess.Api.Models.GameModels;

public class GetFinishedGamesModel {
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    public List<TimingTypes?> TimingTypeFilters { get; set; }
}
