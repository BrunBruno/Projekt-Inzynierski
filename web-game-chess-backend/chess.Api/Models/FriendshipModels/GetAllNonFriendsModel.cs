
namespace chess.Api.Models.FriendshipModels;

public class GetAllNonFriendsModel {
    public string? Username { get; set; }
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
}
