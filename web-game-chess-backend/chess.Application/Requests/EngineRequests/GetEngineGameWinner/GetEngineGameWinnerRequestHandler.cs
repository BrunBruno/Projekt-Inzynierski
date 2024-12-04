
using chess.Application.Repositories.EngineGameRepositories;
using chess.Application.Services;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.EngineRequests.GetEngineGameWinner;

/// <summary>
/// 
/// </summary>
public class GetEngineGameWinnerRequestHandler : IRequestHandler<GetEngineGameWinnerRequest, GetEngineGameWinnerDto> {

    private readonly IEngineGameRepository _engineGameRepository;
    private readonly IUserContextService _userContextService;

    public GetEngineGameWinnerRequestHandler(
        IEngineGameRepository engineGameRepository,
        IUserContextService userContextService
    ) {
        _engineGameRepository = engineGameRepository;
        _userContextService = userContextService;
    }
    public async Task<GetEngineGameWinnerDto> Handle(GetEngineGameWinnerRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var game = await _engineGameRepository.GetById(request.GameId)
            ?? throw new NotFoundException("Game not found");

        if (game.Player.UserId != userId)
            throw new UnauthorizedException("Not user game");

        if (!game.HasEnded)
            throw new BadRequestException("Game is not ended");


        var winner = new GetEngineGameWinnerDto()
        {
            WinnerColor = game.WinnerColor,
        };

        return winner;
    }
}
