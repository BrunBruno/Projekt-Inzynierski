﻿
using chess.Application.Repositories;
using chess.Application.Services;
using chess.Core.Enums;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.GameRequests.GetPlayer;

/// <summary>
/// Checks if player exists
/// Checks if player is playing - it is only used for getting player during game
/// Returns player dto
/// </summary>
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

        var player = await _playerRepository.GetByUserIdAndGameId(userId, request.GameId) 
            ?? throw new NotFoundException("Player not found.");

        if (player.Color is null || !player.IsPlaying)
            throw new BadRequestException("Player has not been aligned to game yet.");

        var playerDto = new GetPlayerDto()
        {
            Name = player.Name,
            ImageUrl = player.ImageUrl,
            Elo = player.Elo,
            Color = (PieceColor)player.Color,
        };

        return playerDto;
    }
}
