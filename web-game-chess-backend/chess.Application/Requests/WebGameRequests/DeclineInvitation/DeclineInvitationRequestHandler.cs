
using chess.Application.Repositories.WebGameRepositories;
using chess.Application.Services;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.WebGameRequests.DeclineInvitation;

/// <summary>
/// Checks if game for provided id exists
/// Checks if user is participant of the game
/// Checks if invitation for game exists
/// Removes game invitation
/// </summary>
public class DeclineInvitationRequestHandler : IRequestHandler<DeclineInvitationRequest> {

    private readonly IUserContextService _userContextService;
    private readonly IWebGameRepository _webGameRepository;
    private readonly IWebGameInvitationRepository _gameInvitationRepository;

    public DeclineInvitationRequestHandler(
        IUserContextService userContextService,
        IWebGameRepository gameRepository,
        IWebGameInvitationRepository gameInvitationRepository
    ) {
        _userContextService = userContextService;
        _webGameRepository = gameRepository;
        _gameInvitationRepository = gameInvitationRepository;
    }

    public async Task Handle(DeclineInvitationRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var game = await _webGameRepository.GetById(request.GameId) 
            ?? throw new NotFoundException("Game not found.");

        if (game.WhitePlayer.UserId != userId && game.BlackPlayer.UserId != userId)
            throw new BadRequestException("This is not user game.");

        var invitation = await _gameInvitationRepository.GetByGameId(request.GameId)
             ?? throw new NotFoundException("Invitation not found.");


        await _gameInvitationRepository.Delete(invitation);
    }
}
