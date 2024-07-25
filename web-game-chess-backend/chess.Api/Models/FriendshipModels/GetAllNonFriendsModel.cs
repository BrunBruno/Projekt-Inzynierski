
using chess.Application.Pagination;

namespace chess.Api.Models.FriendshipModels;

public class GetAllNonFriendsModel : PagedRequest {
    public string? Username { get; set; }
}
