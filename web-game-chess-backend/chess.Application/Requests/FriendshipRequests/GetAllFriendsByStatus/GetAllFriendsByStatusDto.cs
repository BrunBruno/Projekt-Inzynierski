
using chess.Core.Dtos;

namespace chess.Application.Requests.FriendshipRequests.GetAllFriendsByStatus;

public class GetAllFriendsByStatusDto {
    public Guid FreindshpId { get; set; }
    public required string Username { get; set; }
    public string? Name { get; set; }
    public string? ImageUrl { get; set; }
    public bool IsRequestor { get; set; }
    public required EloDto Elo { get; set; }
}


