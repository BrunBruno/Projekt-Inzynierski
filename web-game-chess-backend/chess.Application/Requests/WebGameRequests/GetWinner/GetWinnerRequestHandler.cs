
using chess.Application.Repositories.WebGameRepositories;
using chess.Application.Services;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.WebGameRequests.GetWinner;

/// <summary>
/// Checks if game exists and user is player of game
/// Creates and returs winner dto
/// </summary>
public class GetWinnerRequestHandler : IRequestHandler<GetWinnerRequest, GetWinnerDto> {

    private readonly IUserContextService _userContextService;
    private readonly IWebGameRepository _webGameRepository;

    public GetWinnerRequestHandler(
        IUserContextService userContextService,
        IWebGameRepository webGameRepository
    ) {
        _userContextService = userContextService;
        _webGameRepository = webGameRepository;
    }

    public async Task<GetWinnerDto> Handle(GetWinnerRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var game = await _webGameRepository.GetById(request.GameId)
            ?? throw new NotFoundException("Game not found");

        if (game.WhitePlayer.UserId != userId && game.BlackPlayer.UserId != userId)
            throw new UnauthorizedException("Not user game");

        if (!game.HasEnded)
            throw new BadRequestException("Game not ended");

        var winner = new GetWinnerDto()
        {
            WinnerColor = game.WinnerColor,
            EloGain = game.EloGain,
        };

        return winner;
    }
}
