
using chess.Application.Repositories;
using chess.Application.Services;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.GameRequests.GetPlayer;

public class GetPlayerRequestHandler : IRequestHandler<GetPlayerRequest, GetPlayerDto> {

    private readonly IPlayerRepository _playerRepository;
    private readonly IUserContextService _userContextService;

    public GetPlayerRequestHandler(
        IPlayerRepository playerRepository,
        IGameRepository gameRepository,
        IUserContextService userContextService
    ) {
        _playerRepository = playerRepository;
        _userContextService = userContextService;
    }

    public async Task<GetPlayerDto> Handle(GetPlayerRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();


        var player = await _playerRepository.GetByUserIdandGameId(userId, request.GameId) 
            ?? throw new NotFoundException("Player not found.");

        var playerDto = new GetPlayerDto()
        {
            Name = player.Name,
            Elo = player.Elo,
            Color = player.Color,
        };

        return playerDto;
    }
}
