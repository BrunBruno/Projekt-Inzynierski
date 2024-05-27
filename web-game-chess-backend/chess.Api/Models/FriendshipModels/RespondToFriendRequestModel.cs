
namespace chess.Api.Models.FriendshipModels;

public class RespondToFriendRequestModel {
    public Guid FriendshipId { get; set; }
    public bool IsAccepted { get; set; }
}
