
using MediatR;

namespace chess.Application.Requests.GameRequests.AcceptInvitation;

/// <summary>
/// Request to update player and invitation status
/// Incdrectly starts the game
/// </summary>
public class AcceptInvitationRequest : IRequest {

    /// <summary>
    /// Game id
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
}
