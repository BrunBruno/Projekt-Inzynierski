
using chess.Application.Pagination;
using chess.Application.Repositories;
using chess.Application.Services;
using MediatR;

namespace chess.Application.Requests.GameRequests.GetAllInvitations;

public class GetAllInvitationsRequestHandler : IRequestHandler<GetAllInvitationsRequest, PagedResult<GetAllInvitationsDto>> {

    private readonly IUserContextService _userContextService;
    private readonly IInvitationRepository _invitationRepository;

    public GetAllInvitationsRequestHandler(IUserContextService userContextService, IInvitationRepository invitationRepository) {
        _userContextService = userContextService;
        _invitationRepository = invitationRepository;
    }

    public async Task<PagedResult<GetAllInvitationsDto>> Handle(GetAllInvitationsRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var invitations = await _invitationRepository.GetAllForUser(userId);

        var invitationsDtos = invitations.Select(invitation => new GetAllInvitationsDto()
        {
            GameId = invitation.GameId,
            InviteeId = invitation.InviteeId,
            InvitorId = invitation.InvitorId,
            InviteeName = invitation.InviteeName,
            InvitorName = invitation.InvitorName,
            CreatedAt = invitation.CreatedAt,
            Type = invitation.Type,
        }).ToList();

        var pagedResult = new PagedResult<GetAllInvitationsDto>(invitationsDtos, invitations.Count, request.PageSize, request.PageNumber);

        return pagedResult;
    }
}
