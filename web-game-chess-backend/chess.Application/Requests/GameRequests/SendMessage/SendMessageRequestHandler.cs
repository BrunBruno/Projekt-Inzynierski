
using chess.Application.Repositories;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Core.Enums;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.GameRequests.SendMessage;

/// <summary>
/// Checks is game for provided id exists
/// Checks if current user belongs to game
/// Creates new message
/// </summary>
public class SendMessageRequestHandler : IRequestHandler<SendMessageRequest> {

    private readonly IPlayerMessageRepository _playerMessageRepository;
    private readonly IGameRepository _gameRepository;
    private readonly IUserContextService _userContextService;

    public SendMessageRequestHandler(
        IPlayerMessageRepository playerMessageRepository,
        IGameRepository gameRepository,
        IUserContextService userContextService
    ) {
        _playerMessageRepository = playerMessageRepository;
        _gameRepository = gameRepository;
        _userContextService = userContextService;
    }

    public async Task Handle(SendMessageRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var game = await _gameRepository.GetById(request.GameId)
            ?? throw new NotFoundException("Game not found.");

        if(game.WhitePlayer.UserId != userId && game.BlackPlayer.UserId != userId)
            throw new UnauthorizedException("This is not user player.");


        var playerId = game.WhitePlayer.UserId == userId ? game.WhitePlayerId : game.BlackPlayerId;

        var message = new PlayerMessage()
        {
            Id = Guid.NewGuid(),
            Content = request.Message,
            PlayerId = playerId,
            Type = MessageType.Normal,
        };


        await _playerMessageRepository.Create(message);
    }
}
