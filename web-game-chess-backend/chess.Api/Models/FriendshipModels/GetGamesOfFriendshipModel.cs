
using chess.Application.Pagination;

namespace chess.Api.Models.FriendshipModels;

public class GetGamesOfFriendshipModel : PagedRequest {
    public Guid FriendshipId { get; set; }
}
