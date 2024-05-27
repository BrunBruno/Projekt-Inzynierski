
using chess.Core.Dtos;

namespace chess.Application.Requests.FriendshipRequests.GetAllNonFriends;

public class GetAllNonFriendsDto {
    public Guid UserId { get; set; }
    public required string Username { get; set; }
    public string? Name { get; set; }
    public string? ImageUrl { get; set; }
    public required EloDto Elo { get; set; }
}
