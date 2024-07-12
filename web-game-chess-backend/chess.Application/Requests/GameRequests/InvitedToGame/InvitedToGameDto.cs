
using chess.Core.Enums;

namespace chess.Application.Requests.GameRequests.InvitedToGame;

public class InvitedToGameDto
{
    public Guid GameId { get; set; }
    public Guid InviteeId { get; set; }
    public Guid InviterId { get; set; }
    public required string Inviter { get; set; }
    public TimingTypes Type { get; set; }
    public int Minutes { get; set; }
    public int Increment { get; set; }
}
