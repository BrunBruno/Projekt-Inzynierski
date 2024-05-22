
namespace chess.Api.Models.FriendshipModels;

public class InviteFriendModel {
    public Guid RequestorId { get; set; }
    public Guid ReceiverId { get; set; }
}
