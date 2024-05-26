namespace chess.Api.Models.GameModels;

public class AcceptInvitationModel {
    public Guid GameId { get; set; }
    public Guid InvitorId { get; set; }
    public Guid InviteeId { get; set; }
}
