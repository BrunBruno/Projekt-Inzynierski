﻿
using chess.Application.Repositories.WebGameRepositories;
using chess.Application.Services;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.WebGameRequests.GetOpponent;

/// <summary>
/// Checks if previous game exists
/// Checks if previous game was for current user
/// Gets and returns opponent id
/// </summary>
public class GetOpponentRequestHandler : IRequestHandler<GetOpponentRequest, GetOpponentDto> {

    private readonly IUserContextService _userContextService;
    private readonly IWebGameRepository _webGameRepository;

    public GetOpponentRequestHandler(
        IUserContextService userContextService,
        IWebGameRepository gameRepository
    ) {
        _userContextService = userContextService;
        _webGameRepository = gameRepository;
    }

    public async Task<GetOpponentDto> Handle(GetOpponentRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var game = await _webGameRepository.GetById(request.GameId)
            ?? throw new NotFoundException("Game not found.");

        if (game.WhitePlayer.UserId != userId && game.BlackPlayer.UserId != userId)
            throw new UnauthorizedException("This is not user game.");

        Guid opponentId = game.WhitePlayer.UserId == userId ? game.BlackPlayer.UserId : game.WhitePlayer.UserId;

        var getOpponentDto = new GetOpponentDto()
        {
            OpponentId = opponentId,
        };

        return getOpponentDto;
    }
}
