
using chess.Application.Pagination;
using chess.Core.Enums;

namespace chess.Api.Models.FriendshipModels; 

public class GetAllFriendsByStatusModel : PagedRequest {
    public string? Username { get; set; }
    public FriendshipStatus Status { get; set; }

}
