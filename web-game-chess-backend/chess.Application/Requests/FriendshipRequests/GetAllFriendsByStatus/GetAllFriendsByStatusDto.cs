
namespace chess.Application.Requests.FriendshipRequests.GetAllFriendsByStatus;

public class GetAllFriendsByStatusDto {
    public Guid FreindshpId { get; set; }
    public required string Username { get; set; }
    public string? Name { get; set; }
    public string? ImageUrl { get; set; }
    public int Elo { get; set; }
    public bool IsRequestor { get; set; }
}
