
namespace chess.Application.Requests.FriendshipRequests.GetAllFriendsByStatus;

public class GetAllFriendsByStatusDto {
    public required string Username { get; set; }
    public string? Name { get; set; }
    public string? ImageUrl { get; set; }
    public int Elo { get; set; }
}
