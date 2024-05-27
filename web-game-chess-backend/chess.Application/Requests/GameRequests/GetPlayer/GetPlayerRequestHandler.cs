
using chess.Application.Repositories;
using chess.Application.Services;
using chess.Core.Enums;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.GameRequests.GetPlayer;

public class GetPlayerRequestHandler : IRequestHandler<GetPlayerRequest, GetPlayerDto> {

    private readonly IPlayerRepository _playerRepository;
    private readonly IUserContextService _userContextService;

    public GetPlayerRequestHandler(
        IPlayerRepository playerRepository,
        IUserContextService userContextService
    ) {
        _playerRepository = playerRepository;
        _userContextService = userContextService;
    }

    public async Task<GetPlayerDto> Handle(GetPlayerRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var player = await _playerRepository.GetByUserIdandGameId(userId, request.GameId) 
            ?? throw new NotFoundException("Player not found.");

        if (player.Color is null || !player.IsPlaying)
            throw new BadRequestException("Player has not been asigned to game yet.");

        if (player.FinishedGame)
            throw new BadRequestException("Game for player has been already finishd.");

        var playerDto = new GetPlayerDto()
        {
            Name = player.Name,
            Elo = player.Elo,
            Color = (Colors)player.Color!,
        };

        return playerDto;
    }
}
