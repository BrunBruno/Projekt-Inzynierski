
using chess.Core.Enums;

namespace chess.Core.Entities;
#pragma warning disable CS8618

/// <summary>
/// Invitation entity
/// </summary>
public class Invitation {

    /// <summary>
    /// Id
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// User as invitor id
    /// </summary>
    public Guid InvitorId { get; set; }

    /// <summary>
    /// Invitor username
    /// </summary>
    public string InvitorName { get; set; }

    /// <summary>
    /// User as invitee id
    /// </summary>
    public Guid InviteeId { get; set; }

    /// <summary>
    /// Invitee username
    /// </summary>
    public string InviteeName { get; set; }

    /// <summary>
    /// Date of creation
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// For which timing type it refers to
    /// </summary>
    public TimingTypes Type { get; set; }

    /// <summary>
    /// Flag if invitation was accepted or declined
    /// </summary>
    public bool IsAccepted { get; set; } = false;

    /// <summary>
    /// Game id
    /// </summary>
    public Guid GameId { get; set; }

    /// <summary>
    /// Game to which invitation blengos to
    /// </summary>
    public Game Game { get; set; }
}
