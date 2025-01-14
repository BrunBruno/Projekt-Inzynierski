﻿
using chess.Application.Repositories.WebGameRepositories;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Core.Enums;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.WebGameRequests.SendDrawMessage;

/// <summary>
/// Checks if game for provided id exists
/// Checks if current user belongs to game
/// Checks if any draw message exists
/// Creates draw message if not exists
/// </summary>
public class SendDrawMessageRequestHandler : IRequestHandler<SendDrawMessageRequest> {

    private readonly IWebGameMessageRepository _gameMessageRepository;
    private readonly IWebGameRepository _webGameRepository;
    private readonly IUserContextService _userContextService;

    public SendDrawMessageRequestHandler(
        IWebGameMessageRepository gameMessageRepository,
        IWebGameRepository gameRepository,
        IUserContextService userContextService
    ) {
        _gameMessageRepository = gameMessageRepository;
        _webGameRepository = gameRepository;
        _userContextService = userContextService;
    }

    public async Task Handle(SendDrawMessageRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var game = await _webGameRepository.GetById(request.GameId)
            ?? throw new NotFoundException("Game not found.");

        if (game.WhitePlayer.UserId != userId && game.BlackPlayer.UserId != userId)
            throw new UnauthorizedException("This is not user game.");


        var drawMessage = await _gameMessageRepository.GetDrawMessage(request.GameId);

        if (drawMessage is not null)
            throw new BadRequestException("Draw offer already exists.");


        var userPlayerName = game.WhitePlayer.UserId == userId ? game.WhitePlayer.Name : game.BlackPlayer.Name;

        var message = new WebGameMessage()
        {
            Id = Guid.NewGuid(),
            RequestorName = userPlayerName,
            Content = $"{userPlayerName} offered a draw.",
            Type = MessageType.DrawAction,
            GameId = game.Id,
        };


        await _gameMessageRepository.Create(message);
    }
}
