
using chess.Application.Pagination;
using MediatR;

namespace chess.Application.Requests.GameRequests.GetAllInvitations;

public class GetAllInvitationsRequest : PagedRequest, IRequest<PagedResult<GetAllInvitationsDto>> {
}
