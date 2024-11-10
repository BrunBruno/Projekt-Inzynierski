
namespace chess.Api.Models.WebGameModels;

public class DeclineWebGameInvitationModel {
    public Guid GameId { get; set; }
    public Guid FriendId { get; set; }
}
