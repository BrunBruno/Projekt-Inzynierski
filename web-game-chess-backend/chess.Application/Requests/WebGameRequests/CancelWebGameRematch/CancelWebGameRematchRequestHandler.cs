
using chess.Application.Repositories.WebGameRepositories;
using chess.Application.Services;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.WebGameRequests.CancelWebGameRematch;

/// <summary>
/// Checks if game exists
/// Checks if user belongs to game
/// </summary>
public class CancelWebGameRematchRequestHandler : IRequestHandler<CancelWebGameRematchRequest> {

    private readonly IUserContextService _userContextService;
    private readonly IWebGameRepository _webGameRepository;

    public CancelWebGameRematchRequestHandler(
        IUserContextService userContextService,
        IWebGameRepository webGameRepository
    ) {
        _userContextService = userContextService;
        _webGameRepository = webGameRepository;
    }

    public async Task Handle(CancelWebGameRematchRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var game = await _webGameRepository.GetById(request.NewGameId)
            ?? throw new NotFoundException("Game not found.");

        if (game.WhitePlayer.UserId != userId && game.BlackPlayer.UserId != userId)
            throw new UnauthorizedException("Not user game.");
    }
}
