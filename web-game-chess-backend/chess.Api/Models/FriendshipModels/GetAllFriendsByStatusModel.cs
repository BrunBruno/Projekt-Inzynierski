
using chess.Core.Enums;

namespace chess.Api.Models.FriendshipModels; 

public class GetAllFriendsByStatusModel {
    public string? Username { get; set; }
    public FriendshipStatus Status { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 100;
}
