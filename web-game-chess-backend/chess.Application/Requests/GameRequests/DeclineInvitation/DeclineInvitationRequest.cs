
using MediatR;

namespace chess.Application.Requests.GameRequests.DeclineInvitation;

/// <summary>
/// Request to delete invitations
/// </summary>
public class DeclineInvitationRequest : IRequest {

    /// <summary>
    /// Id of game invited to
    /// </summary>
    public Guid GameId { get; set; }
}
