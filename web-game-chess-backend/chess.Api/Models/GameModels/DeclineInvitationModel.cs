namespace chess.Api.Models.GameModels;

public class DeclineInvitationModel {
    public Guid GameId { get; set; }
    public Guid FriendId { get; set; }
}
