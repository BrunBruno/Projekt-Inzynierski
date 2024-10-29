
using chess.Application.Repositories.WebGameRepositories;
using chess.Application.Services;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.GameRequests.AcceptRematch;

/// <summary>
/// Checks if game exists
/// Checks if user belongs to game
/// Gets both players for provided game
/// Updates players
/// Returns users ids
/// </summary>
public class AcceptRematchRequestHandler : IRequestHandler<AcceptRematchRequest, AcceptRematchDto> {

    private readonly IWebGameRepository _gameRepository;
    private readonly IUserContextService _userContextService;
    private readonly IWebGamePlayerRepository _playerRepository;

    public AcceptRematchRequestHandler(
        IWebGameRepository gameRepository,
        IUserContextService userContextService,
        IWebGamePlayerRepository playerRepository
    ) {
        _gameRepository = gameRepository;
        _userContextService = userContextService;
        _playerRepository = playerRepository;
    }

    public async Task<AcceptRematchDto> Handle(AcceptRematchRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var game = await _gameRepository.GetById(request.GameId)
            ?? throw new NotFoundException("Game not found.");

        if (game.WhitePlayer.UserId != userId && game.BlackPlayer.UserId != userId)
            throw new UnauthorizedException("This is not user game.");


        var whitePlayer = await _playerRepository.GetById(game.WhitePlayerId)
            ?? throw new NotFoundException("Player not found.");

        var blackPlayer = await _playerRepository.GetById(game.BlackPlayerId)
            ?? throw new NotFoundException("Player not found.");


        whitePlayer.IsPlaying = true;
        blackPlayer.IsPlaying = true;


        await _playerRepository.Update(whitePlayer);
        await _playerRepository.Update(blackPlayer);


        var acceptRematchDto = new AcceptRematchDto()
        {
            WhitePlayerUserId = game.WhitePlayer.UserId,
            BlackPlayerUserId = game.BlackPlayer.UserId,
        };

        return acceptRematchDto;
    }
}
