
using chess.Application.Repositories.WebGameRepositories;
using chess.Application.Services;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.WebGameRequests.CheckIfInWebGame;

/// <summary>
/// Checks if player for current user exists
/// Checks if player is playing
/// Return is playing dto
/// </summary>
public class CheckIfInWebGameRequestHandler : IRequestHandler<CheckIfInWebGameRequest, CheckIfInWebGameDto> {

    private readonly IWebGamePlayerRepository _webGamePlayerRepository;
    private readonly IWebGameRepository _webGameRepository;
    private readonly IUserContextService _userContextService;

    public CheckIfInWebGameRequestHandler(
        IWebGamePlayerRepository playerRepository,
        IWebGameRepository gameRepository,
        IUserContextService userContextService
    ) {
        _webGamePlayerRepository = playerRepository;
        _webGameRepository = gameRepository;
        _userContextService = userContextService;
    }

    public async Task<CheckIfInWebGameDto> Handle(CheckIfInWebGameRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var player = await _webGamePlayerRepository.GetById(request.PlayerId)
            ?? throw new NotFoundException("Player not found.");

        if (userId != player.UserId)
            throw new UnauthorizedException("Can not check status of not owned player.");

        var isInGameDto = new CheckIfInWebGameDto()
        {
            IsInGame = player.IsPlaying,
            GameId = null,
        };

        if (player.IsPlaying) {
            var game = await _webGameRepository.GetGameForPlayer(player.Id)
               ?? throw new NotFoundException("Game not found.");

            isInGameDto.GameId = game.Id;
        }

        return isInGameDto;
    }
}
    
