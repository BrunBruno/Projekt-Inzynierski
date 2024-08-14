
using chess.Application.Repositories;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.GameRequests.SendMessage;

/// <summary>
/// Creates new message
/// </summary>
public class SendMessageRequestHandler : IRequestHandler<SendMessageRequest> {

    private readonly IMessageRepository _messageRepository;
    private readonly IGameRepository _gameRepository;
    private readonly IUserContextService _userContextService;

    public SendMessageRequestHandler(
        IMessageRepository messageRepository,
        IGameRepository gameRepository,
        IUserContextService userContextService
    ) {
        _messageRepository = messageRepository;
        _gameRepository = gameRepository;
        _userContextService = userContextService;
    }

    public async Task Handle(SendMessageRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var game = await _gameRepository.GetById(request.GameId)
            ?? throw new NotFoundException("Game not found.");

        if(game.WhitePlayer.UserId != userId && game.BlackPlayer.UserId != userId)
            throw new BadRequestException("This is not user player.");


        var playerId = game.WhitePlayer.UserId == userId ? game.WhitePlayerId : game.BlackPlayerId;

        var message = new Message()
        {
            Id = Guid.NewGuid(),
            Content = request.Message,
            PlayerId = playerId,
        };


        await _messageRepository.Create(message);
    }
}
