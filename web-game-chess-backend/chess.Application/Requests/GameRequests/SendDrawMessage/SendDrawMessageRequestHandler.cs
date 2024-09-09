
using chess.Application.Repositories;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Core.Enums;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.GameRequests.SendDrawMessage;

/// <summary>
/// Checks if game for provided id exists
/// Checks if current user belgons to game
/// Chekcs if any draw message exists
/// Creates draw message if not exists
/// </summary>
public class SendDrawMessageRequestHandler : IRequestHandler<SendDrawMessageRequest> {

    private readonly IMessageRepository _messageRepository;
    private readonly IGameRepository _gameRepository;
    private readonly IUserContextService _userContextService;

    public SendDrawMessageRequestHandler(
        IMessageRepository messageRepository,
        IGameRepository gameRepository,
        IUserContextService userContextService
    ) {
        _messageRepository = messageRepository;
        _gameRepository = gameRepository;
        _userContextService = userContextService;
    }

    public async Task Handle(SendDrawMessageRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var game = await _gameRepository.GetById(request.GameId)
            ?? throw new NotFoundException("Game not found.");

        if (game.WhitePlayer.UserId != userId && game.BlackPlayer.UserId != userId)
            throw new UnauthorizedException("This is not user game.");


        var drawByWhite = await _messageRepository.GetDrawMessage(game.WhitePlayerId);
        var drawByBlack = await _messageRepository.GetDrawMessage(game.BlackPlayerId);

        if (drawByWhite is not null || drawByBlack is not null)
            throw new BadRequestException("Draw offer already exists.");


        var playerId = game.WhitePlayer.UserId == userId ? game.WhitePlayerId : game.BlackPlayerId;
        var userPlayer = game.WhitePlayer.UserId == userId ? game.WhitePlayer : game.BlackPlayer;

        var message = new Message()
        {
            Id = Guid.NewGuid(),
            Content = $"{userPlayer.Name} offered a draw.",
            PlayerId = playerId,
            Type = MessageType.DrawAction,
        };


        await _messageRepository.Create(message);
    }
}
