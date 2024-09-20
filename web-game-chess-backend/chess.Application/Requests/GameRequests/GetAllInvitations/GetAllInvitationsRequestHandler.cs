
using chess.Application.Pagination;
using chess.Application.Repositories;
using chess.Application.Services;
using MediatR;

namespace chess.Application.Requests.GameRequests.GetAllInvitations;

/// <summary>
/// Get all invitations that belongs to user
/// Returns paged result of invitation dtos
/// </summary>
public class GetAllInvitationsRequestHandler : IRequestHandler<GetAllInvitationsRequest, PagedResult<GetAllInvitationsDto>> {

    private readonly IUserContextService _userContextService;
    private readonly IGameInvitationRepository _gameInvitationRepository;

    public GetAllInvitationsRequestHandler(
        IUserContextService userContextService,
        IGameInvitationRepository gameInvitationRepository
    ) {
        _userContextService = userContextService;
        _gameInvitationRepository = gameInvitationRepository;
    }

    public async Task<PagedResult<GetAllInvitationsDto>> Handle(GetAllInvitationsRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var invitations = await _gameInvitationRepository.GetAllForUser(userId);

        var invitationsDtos = invitations.Select(invitation => new GetAllInvitationsDto()
        {
            GameId = invitation.GameId,
            InviteeId = invitation.InviteeId,
            InviterId = invitation.InviterId,
            InviteeName = invitation.InviteeName,
            InviterName = invitation.InviterName,
            CreatedAt = invitation.CreatedAt,
            Type = invitation.Type,
        }).ToList();

        var pagedResult = new PagedResult<GetAllInvitationsDto>(invitationsDtos, invitations.Count, request.PageSize, request.PageNumber);

        return pagedResult;
    }
}
