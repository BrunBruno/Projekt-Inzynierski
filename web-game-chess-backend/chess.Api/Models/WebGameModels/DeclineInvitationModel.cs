
namespace chess.Api.Models.WebGameModels;

public class DeclineInvitationModel {
    public Guid GameId { get; set; }
    public Guid FriendId { get; set; }
}
