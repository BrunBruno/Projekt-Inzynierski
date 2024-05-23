
using chess.Core.Enums;

namespace chess.Api.Models.FriendshipModels; 

public class GetAllFriendsByStatusModel {
    public FriendshipStatus Status { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 100;
}
