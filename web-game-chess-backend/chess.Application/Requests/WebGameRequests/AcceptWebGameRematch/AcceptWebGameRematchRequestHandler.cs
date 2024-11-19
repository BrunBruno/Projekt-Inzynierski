
using chess.Application.Repositories.WebGameRepositories;
using chess.Application.Services;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.WebGameRequests.AcceptWebGameRematch;

/// <summary>
/// Checks if game exists
/// Checks if user belongs to game
/// Gets both players for provided game
/// Updates players
/// Returns users ids
/// </summary>
public class AcceptWebGameRematchRequestHandler : IRequestHandler<AcceptWebGameRematchRequest, AcceptWebGameRematchDto> {

    private readonly IWebGameRepository _webGameRepository;
    private readonly IUserContextService _userContextService;
    private readonly IWebGamePlayerRepository _webGamePlayerRepository;

    public AcceptWebGameRematchRequestHandler(
        IWebGameRepository gameRepository,
        IUserContextService userContextService,
        IWebGamePlayerRepository playerRepository
    ) {
        _webGameRepository = gameRepository;
        _userContextService = userContextService;
        _webGamePlayerRepository = playerRepository;
    }

    public async Task<AcceptWebGameRematchDto> Handle(AcceptWebGameRematchRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var game = await _webGameRepository.GetById(request.GameId)
            ?? throw new NotFoundException("Game not found.");

        if (game.WhitePlayer.UserId != userId && game.BlackPlayer.UserId != userId)
            throw new UnauthorizedException("This is not user game.");


        var whitePlayer = await _webGamePlayerRepository.GetById(game.WhitePlayerId)
            ?? throw new NotFoundException("Player not found.");

        var blackPlayer = await _webGamePlayerRepository.GetById(game.BlackPlayerId)
            ?? throw new NotFoundException("Player not found.");


        whitePlayer.IsPlaying = true;
        blackPlayer.IsPlaying = true;


        await _webGamePlayerRepository.Update(whitePlayer);
        await _webGamePlayerRepository.Update(blackPlayer);


        var returnDto = new AcceptWebGameRematchDto()
        {
            WhitePlayerUserId = game.WhitePlayer.UserId,
            BlackPlayerUserId = game.BlackPlayer.UserId,
        };

        return returnDto;
    }
}
