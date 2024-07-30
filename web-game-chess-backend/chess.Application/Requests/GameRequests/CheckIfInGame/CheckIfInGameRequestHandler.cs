
using chess.Application.Repositories;
using chess.Application.Services;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.GameRequests.CheckIfInGame;

/// <summary>
/// Checks if player for current user exists
/// Checks if player is playing
/// Return is playing dto
/// </summary>
public class CheckIfInGameRequestHandler : IRequestHandler<CheckIfInGameRequest, CheckIfInGameDto> {

    private readonly IPlayerRepository _playerRepository;
    private readonly IGameRepository _gameRepository;
    private readonly IUserContextService _userContextService;

    public CheckIfInGameRequestHandler(
        IPlayerRepository playerRepository,
        IGameRepository gameRepository,
        IUserContextService userContextService
    ) {
        _playerRepository = playerRepository;
        _gameRepository = gameRepository;
        _userContextService = userContextService;
    }

    public async Task<CheckIfInGameDto> Handle(CheckIfInGameRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var player = await _playerRepository.GetById(request.PlayerId)
            ?? throw new NotFoundException("Player not found.");

        if (userId != player.UserId)
            throw new UnauthorizedException("Can not check status of not owned player.");

        var isInGameDto = new CheckIfInGameDto()
        {
            IsInGame = player.IsPlaying,
            GameId = null,
        };

        if (player.IsPlaying) {
            var game = await _gameRepository.GetGameForPlayer(player.Id)
               ?? throw new NotFoundException("Game not found.");

            isInGameDto.GameId = game.Id;
        }

        return isInGameDto;
    }
}
    
