
using chess.Core.Enums;

namespace chess.Application.Requests.GameRequests.GetAllInvitations;

public class GetAllInvitationsDto {

    public Guid GameId { get; set; }
    public Guid InvitorId { get; set; }
    public Guid InviteeId { get; set; }

    public required string InvitorName { get; set; }
    public required string InviteeName { get; set; }

    public DateTime CreatedAt { get; set; }
    public TimingTypes Type { get; set; }

}
