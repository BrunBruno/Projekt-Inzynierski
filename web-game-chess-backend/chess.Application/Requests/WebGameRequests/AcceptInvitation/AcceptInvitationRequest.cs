
using MediatR;

namespace chess.Application.Requests.WebGameRequests.AcceptInvitation;

/// <summary>
/// Request to update player and invitation status
/// Indirectly starts the game
/// </summary>
public class AcceptInvitationRequest : IRequest {

    /// <summary>
    /// Game id
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
}
