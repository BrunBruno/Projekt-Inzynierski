
using chess.Core.Enums;

namespace chess.Api.Models.FriendshipModels; 

public class GetAllFriendsByStatusModel {
    public FriendshipStatus Statis { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 100;
}
