
using chess.Application.Repositories.WebGameRepositories;
using chess.Application.Services;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.WebGameRequests.CancelRematch;

public class CancelRematchRequestHandler : IRequestHandler<CancelRematchRequest> {

    private readonly IUserContextService _userContextService;
    private readonly IWebGameRepository _webGameRepository;

    public CancelRematchRequestHandler(
        IUserContextService userContextService,
        IWebGameRepository webGameRepository
    ) {
        _userContextService = userContextService;
        _webGameRepository = webGameRepository;
    }

    public async Task Handle(CancelRematchRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var game = await _webGameRepository.GetById(request.NewGameId)
            ?? throw new NotFoundException("Game not found.");

        if (game.WhitePlayer.UserId != userId && game.BlackPlayer.UserId != userId)
            throw new UnauthorizedAccessException("Not user game.");
    }
}
