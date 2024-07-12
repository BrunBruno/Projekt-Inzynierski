
using chess.Core.Enums;

namespace chess.Core.Entities;
#pragma warning disable CS8618

public class Invitation {
    public Guid Id { get; set; }

    public Guid InvitorId { get; set; }
    public string InvitorName { get; set; }

    public Guid InviteeId { get; set; }
    public string InviteeName { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public TimingTypes Type { get; set; }

    public bool IsAccepted { get; set; } = false;

    public Guid GameId { get; set; }
    public Game Game { get; set; }
}
