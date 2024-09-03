
using chess.Application.Repositories;
using chess.Application.Services;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.GameRequests.CancelPrivateGame;

public class CancelPrivateGameRequestHandler : IRequestHandler<CancelPrivateGameRequest> {

    private readonly IGameRepository _gameRepository;
    private readonly IUserContextService _userContextService;
    private readonly IPlayerRepository _playerRepository;

    public CancelPrivateGameRequestHandler(
        IGameRepository gameRepository,
        IUserContextService userContextService,
        IPlayerRepository playerRepository
    ) {
        _gameRepository = gameRepository;
        _userContextService = userContextService;
        _playerRepository = playerRepository;
    }

    public async Task Handle(CancelPrivateGameRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var gameToDelete = await _gameRepository.GetById(request.GameId)
            ?? throw new NotFoundException("Game not found.");

        if (gameToDelete.WhitePlayer.UserId != userId && gameToDelete.BlackPlayer.UserId != userId)
            throw new UnauthorizedException("User is not player of game.");


        var whitePlayer = await _playerRepository.GetById(gameToDelete.WhitePlayerId)
             ?? throw new NotFoundException("White player not found.");

        var blackPlayer = await _playerRepository.GetById(gameToDelete.BlackPlayerId)
             ?? throw new NotFoundException("Black player not found.");


        await _playerRepository.Delete(whitePlayer);
        await _playerRepository.Delete(blackPlayer);

        await _gameRepository.Delete(gameToDelete);
    }
}
