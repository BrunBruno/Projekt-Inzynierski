
using chess.Application.Repositories.WebGameRepositories;
using chess.Application.Services;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.WebGameRequests.AddPlayerToWebGame;

public class AddPlayerToWebGameRequestHandler : IRequestHandler<AddPlayerToWebGameRequest> {

    private readonly IWebGameRepository _webGameRepository;
    private readonly IUserContextService _userContextService;

    public AddPlayerToWebGameRequestHandler(IWebGameRepository webGameRepository, IUserContextService userContextService) {
        _webGameRepository = webGameRepository;
        _userContextService = userContextService;
    }

    public async Task Handle(AddPlayerToWebGameRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var game = await _webGameRepository.GetById(request.GameId)
            ?? throw new NotFoundException("Game not found.");

        if (game.WhitePlayer.UserId != userId && game.BlackPlayer.UserId != userId)
            throw new UnauthorizedException("User is not player of game.");

    }
}
