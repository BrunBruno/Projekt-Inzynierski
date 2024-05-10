
using chess.Application.Repositories;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.GameRequests.CheckIfInGame;

public class CheckIfInGameRequestHandler : IRequestHandler<CheckIfInGameRequest, CheckIfInGameDto> {

    private readonly IPlayerRepository _playerRepository;
    private readonly IGameRepository _gameRepository;

    public CheckIfInGameRequestHandler(
        IPlayerRepository playerRepository,
        IGameRepository gameRepository
    ) {
        _playerRepository = playerRepository;
        _gameRepository = gameRepository;
    }

    public async Task<CheckIfInGameDto> Handle(CheckIfInGameRequest request, CancellationToken cancellationToken) {

        var player = await _playerRepository.GetById(request.PlayerId)
            ?? throw new NotFoundException("Player not found.");

        var isInGameDto = new CheckIfInGameDto()
        {
            IsInGame = player.IsPlaying,
        };

        if (player.IsPlaying) {
            var game = await _gameRepository.GetGameForPlayer(player.Id)
               ?? throw new NotFoundException("Game not found.");

            isInGameDto.GameId = game.Id;
        }

        return isInGameDto;
    }
}
    
