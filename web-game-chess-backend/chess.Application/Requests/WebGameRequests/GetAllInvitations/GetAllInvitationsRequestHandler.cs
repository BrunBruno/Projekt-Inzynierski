
using chess.Application.Pagination;
using chess.Application.Repositories.WebGameRepositories;
using chess.Application.Services;
using MediatR;

namespace chess.Application.Requests.WebGameRequests.GetAllInvitations;

/// <summary>
/// Get all invitations that belongs to user
/// Returns paged result of invitation dtos
/// </summary>
public class GetAllInvitationsRequestHandler : IRequestHandler<GetAllInvitationsRequest, PagedResult<GetAllInvitationsDto>> {

    private readonly IUserContextService _userContextService;
    private readonly IWebGameInvitationRepository _gameInvitationRepository;

    public GetAllInvitationsRequestHandler(
        IUserContextService userContextService,
        IWebGameInvitationRepository gameInvitationRepository
    ) {
        _userContextService = userContextService;
        _gameInvitationRepository = gameInvitationRepository;
    }

    public async Task<PagedResult<GetAllInvitationsDto>> Handle(GetAllInvitationsRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var invitations = await _gameInvitationRepository.GetAllForUser(userId);

        var invitationsDtos = invitations.Select(invitation => {
            bool hasExpired = DateTime.Now.AddHours(1) > invitation.CreatedAt;

            if (request.ExpirationFilters is not null &&
                request.ExpirationFilters.Any() &&
                !request.ExpirationFilters.Contains(hasExpired)) {
                return null;
            }

            return new GetAllInvitationsDto()
            {
                GameId = invitation.GameId,
                InviteeId = invitation.InviteeId,
                InviterId = invitation.InviterId,
                InviteeName = invitation.InviteeName,
                InviterName = invitation.InviterName,
                CreatedAt = invitation.CreatedAt,
                Type = invitation.Type,
            };
        }).Where(dto => dto != null).ToList();


        var pagedResult = new PagedResult<GetAllInvitationsDto>(invitationsDtos!, invitations.Count, request.PageSize, request.PageNumber);

        return pagedResult;
    }
}
