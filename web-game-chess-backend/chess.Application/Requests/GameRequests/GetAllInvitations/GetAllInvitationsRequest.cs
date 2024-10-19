
using chess.Application.Pagination;
using MediatR;

namespace chess.Application.Requests.GameRequests.GetAllInvitations;

/// <summary>
/// Request to get all previous invitations
/// </summary>
public class GetAllInvitationsRequest : PagedRequest, IRequest<PagedResult<GetAllInvitationsDto>> {

    /// <summary>
    /// Is invitation expired filter list
    /// </summary>
    public List<bool>? ExpirationFilters { get; set; }
}
