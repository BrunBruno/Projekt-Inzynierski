
using chess.Application.Repositories.WebGameRepositories;
using chess.Application.Services;
using chess.Core.Enums;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.WebGameRequests.GetWebGameWinner;

/// <summary>
/// Checks if game exists and user is player of game
/// Creates and returns winner dto
/// </summary>
public class GetWebGameWinnerRequestHandler : IRequestHandler<GetWebGameWinnerRequest, GetWebGameWinnerDto> {

    private readonly IUserContextService _userContextService;
    private readonly IWebGameRepository _webGameRepository;

    public GetWebGameWinnerRequestHandler(
        IUserContextService userContextService,
        IWebGameRepository webGameRepository
    ) {
        _userContextService = userContextService;
        _webGameRepository = webGameRepository;
    }

    public async Task<GetWebGameWinnerDto> Handle(GetWebGameWinnerRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var game = await _webGameRepository.GetById(request.GameId)
            ?? throw new NotFoundException("Game not found");

        if (game.WhitePlayer.UserId != userId && game.BlackPlayer.UserId != userId)
            throw new UnauthorizedException("Not user game");

        if (!game.HasEnded || game.EndGameType == null)
            throw new BadRequestException("Game not ended");

        var winner = new GetWebGameWinnerDto()
        {
            WinnerColor = game.WinnerColor,
            EloGain = game.EloGain,
            GameEndReason = (GameEndReason)game.EndGameType,
        };

        return winner;
    }
}
