
using chess.Core.Enums;

namespace chess.Api.Models.GameModels;

public class GetFinishedGamesModel {
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}
