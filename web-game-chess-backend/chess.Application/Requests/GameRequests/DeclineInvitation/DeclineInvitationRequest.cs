
using MediatR;

namespace chess.Application.Requests.GameRequests.DeclineInvitation;

public class DeclineInvitationRequest : IRequest {
    public Guid GameId { get; set; }
}
