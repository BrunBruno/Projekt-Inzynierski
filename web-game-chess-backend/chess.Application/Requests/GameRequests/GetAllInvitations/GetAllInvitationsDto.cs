
using chess.Core.Enums;

namespace chess.Application.Requests.GameRequests.GetAllInvitations;

/// <summary>
/// Invitation entity dto
/// </summary>
public class GetAllInvitationsDto {

    /// <summary>
    /// Game id that invitation realtes to
    /// </summary>
    public Guid GameId { get; set; }

    /// <summary>
    /// Invitor id
    /// </summary>
    public Guid InvitorId { get; set; }

    /// <summary>
    /// Invitee id
    /// </summary>
    public Guid InviteeId { get; set; }

    /// <summary>
    /// Initor username
    /// </summary>
    public required string InvitorName { get; set; }

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
