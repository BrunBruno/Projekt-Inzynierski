
using chess.Application.Pagination;
using chess.Core.Enums;

namespace chess.Api.Models.FriendshipModels;

public class GetFriendshipRankingModel : PagedRequest {
    public TimingTypes Type { get; set; }
}
