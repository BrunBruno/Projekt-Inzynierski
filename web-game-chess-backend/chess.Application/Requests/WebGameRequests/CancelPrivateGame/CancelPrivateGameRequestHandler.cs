
using chess.Application.Repositories.WebGameRepositories;
using chess.Application.Services;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.WebGameRequests.CancelPrivateGame;

/// <summary>
/// Checks if game for provided id exists
/// Checks if current user belongs to game
/// Checks if game is private
/// Checks if both players for obtained game exist
/// Removes players
/// Removes Private game
/// </summary>
public class CancelPrivateGameRequestHandler : IRequestHandler<CancelPrivateGameRequest> {

    private readonly IWebGameRepository _webGameRepository;
    private readonly IUserContextService _userContextService;
    private readonly IWebGamePlayerRepository _webGamePlayerRepository;

    public CancelPrivateGameRequestHandler(
        IWebGameRepository gameRepository,
        IUserContextService userContextService,
        IWebGamePlayerRepository playerRepository
    ) {
        _webGameRepository = gameRepository;
        _userContextService = userContextService;
        _webGamePlayerRepository = playerRepository;
    }

    public async Task Handle(CancelPrivateGameRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var gameToDelete = await _webGameRepository.GetById(request.GameId)
            ?? throw new NotFoundException("Game not found.");

        if (gameToDelete.WhitePlayer.UserId != userId && gameToDelete.BlackPlayer.UserId != userId)
            throw new UnauthorizedException("User is not player of game.");

        if (!gameToDelete.IsPrivate)
            throw new BadRequestException("Can not remove this game.");
       

        var whitePlayer = gameToDelete.WhitePlayer;
        var blackPlayer = gameToDelete.BlackPlayer;


        await _webGameRepository.Delete(gameToDelete);
        await _webGamePlayerRepository.Delete(whitePlayer);
        await _webGamePlayerRepository.Delete(blackPlayer);
    }
}
