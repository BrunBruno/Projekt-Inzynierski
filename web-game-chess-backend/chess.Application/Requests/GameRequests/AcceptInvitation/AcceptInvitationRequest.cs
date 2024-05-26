
using MediatR;

namespace chess.Application.Requests.GameRequests.AcceptInvitation;

public class AcceptInvitationRequest : IRequest {
    public Guid GameId { get; set; }
    public Guid InvitorId { get; set; }
    public Guid InviteeId { get; set; }
}
