
using chess.Application.Repositories.WebGameRepositories;
using chess.Application.Services;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.WebGameRequests.RemoveDrawMessage;

/// <summary>
/// Checks if game for provided id exists
/// Checks if user belong to the game
/// Checks if draw offer already exists
/// Removes draw offer if exists
/// </summary>
public class RemoveDrawMessageRequestHandler : IRequestHandler<RemoveDrawMessageRequest> {

    private readonly IWebGameMessageRepository _gameMessageRepository;
    private readonly IWebGameRepository _webGameRepository;
    private readonly IUserContextService _userContextService;

    public RemoveDrawMessageRequestHandler(
        IWebGameMessageRepository gameMessageRepository,
        IWebGameRepository gameRepository,
        IUserContextService userContextService
    ) {
        _gameMessageRepository = gameMessageRepository;
        _webGameRepository = gameRepository;
        _userContextService = userContextService;
    }

    public async Task Handle(RemoveDrawMessageRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var game = await _webGameRepository.GetById(request.GameId)
            ?? throw new NotFoundException("Game not found.");

        if (game.WhitePlayer.UserId != userId && game.BlackPlayer.UserId != userId)
            throw new UnauthorizedException("This is not user player.");


        var drawMessage = await _gameMessageRepository.GetDrawMessage(request.GameId)
            ?? throw new NotFoundException("Draw offer not found.");;


        await _gameMessageRepository.Delete(drawMessage);
    }
}
