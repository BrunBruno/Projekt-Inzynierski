
using chess.Core.Enums;

namespace chess.Application.Requests.GameRequests.GetAllInvitations;

/// <summary>
/// Invitation entity dto
/// </summary>
public class GetAllInvitationsDto {

    /// <summary>
    /// Game id that invitation relates to
    /// </summary>
    public Guid GameId { get; set; }

    /// <summary>
    /// Inviter id
    /// </summary>
    public Guid InviterId { get; set; }

    /// <summary>
    /// Invitee id
    /// </summary>
    public Guid InviteeId { get; set; }

    /// <summary>
    /// Inviter username
    /// </summary>
    public required string InviterName { get; set; }

    /// <summary>
    /// Invitee username
    /// </summary>
    public required string InviteeName { get; set; }

    /// <summary>
    /// When invitation was sent
    /// </summary>
    public DateTime CreatedAt { get; set; }

    /// <summary>
    /// Timing type choose for that game
    /// </summary>
    public TimingTypes Type { get; set; }

}
