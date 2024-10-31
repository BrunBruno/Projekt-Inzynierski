﻿
using chess.Application.Repositories.WebGameRepositories;
using chess.Application.Services;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.WebGameRequests.GetEndedWebGame;

/// <summary>
/// Checks if game exists
/// Checks if game belongs to current user
/// Checks if game has ended
/// Returns winner of the game
/// </summary>
public class GetEndedWebGameRequestHandler : IRequestHandler<GetEndedWebGameRequest, GetEndedWebGameDto> {

    private readonly IWebGameRepository _gameRepository;
    private readonly IUserContextService _userContextService;

    public GetEndedWebGameRequestHandler(
        IWebGameRepository gameRepository,
        IUserContextService userContextService
    ) { 
        _gameRepository = gameRepository;
        _userContextService = userContextService;
    }

    public async Task<GetEndedWebGameDto> Handle(GetEndedWebGameRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var game = await _gameRepository.GetById(request.GameId)
            ?? throw new NotFoundException("Game not found.");

        if (game.WhitePlayer.UserId != userId && game.BlackPlayer.UserId != userId)
            throw new UnauthorizedException("This is not user game.");

        if (game.HasEnded == false)
            throw new BadRequestException("Game has not ended yet.");

        var returnDto = new GetEndedWebGameDto()
        {
            WinnerColor = game.WinnerColor,
            EloGain = game.EloGain,
        };

        return returnDto;
    }
}