
using chess.Application.Pagination;
using chess.Core.Enums;

namespace chess.Api.Models.UserModels;

public class GetUsersRankingModel : PagedRequest {
    public TimingTypes Type { get; set; }
}
