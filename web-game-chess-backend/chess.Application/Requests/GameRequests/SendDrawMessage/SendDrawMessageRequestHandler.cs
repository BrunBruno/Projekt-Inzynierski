
using chess.Application.Repositories;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Core.Enums;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.GameRequests.SendDrawMessage;

/// <summary>
/// Checks if game for provided id exists
/// Checks if current user belongs to game
/// Checks if any draw message exists
/// Creates draw message if not exists
/// </summary>
public class SendDrawMessageRequestHandler : IRequestHandler<SendDrawMessageRequest> {

    private readonly IGameMessageRepository _gameMessageRepository;
    private readonly IGameRepository _gameRepository;
    private readonly IUserContextService _userContextService;

    public SendDrawMessageRequestHandler(
        IGameMessageRepository gameMessageRepository,
        IGameRepository gameRepository,
        IUserContextService userContextService
    ) {
        _gameMessageRepository = gameMessageRepository;
        _gameRepository = gameRepository;
        _userContextService = userContextService;
    }

    public async Task Handle(SendDrawMessageRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var game = await _gameRepository.GetById(request.GameId)
            ?? throw new NotFoundException("Game not found.");

        if (game.WhitePlayer.UserId != userId && game.BlackPlayer.UserId != userId)
            throw new UnauthorizedException("This is not user game.");


        var drawMessage = await _gameMessageRepository.GetDrawMessage(request.GameId);

        if (drawMessage is not null)
            throw new BadRequestException("Draw offer already exists.");


        var userPlayerName = game.WhitePlayer.UserId == userId ? game.WhitePlayer.Name : game.BlackPlayer.Name;

        var message = new GameMessage()
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
