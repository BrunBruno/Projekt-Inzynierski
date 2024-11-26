
using chess.Core.Enums;

namespace chess.Core.Entities;
#pragma warning disable CS8618

/// <summary>
/// Invitation entity
/// </summary>
public class WebGameInvitation {

    /// <summary>
    /// Id
    /// </summary>
    public Guid Id { get; set; }


    /// <summary>
    /// User as inviter
    /// </summary>
    public Guid InviterId { get; set; }
    public string InviterName { get; set; }



    /// <summary>
    /// User as invitee id
    /// </summary>
    public Guid InviteeId { get; set; }
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
    /// Game to which invitation belongs to
    /// </summary>
    public Guid GameId { get; set; }
    public WebGame Game { get; set; }
}
