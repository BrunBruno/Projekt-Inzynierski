
namespace chess.Api.Models.WebGameModels;

public class AcceptInvitationModel {
    public Guid GameId { get; set; }
    public Guid InviterId { get; set; }
    public Guid InviteeId { get; set; }
}
