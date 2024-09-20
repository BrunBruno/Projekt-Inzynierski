
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

    private readonly IPlayerMessageRepository _playerMessageRepository;
    private readonly IGameRepository _gameRepository;
    private readonly IUserContextService _userContextService;

    public SendDrawMessageRequestHandler(
        IPlayerMessageRepository playerMessageRepository,
        IGameRepository gameRepository,
        IUserContextService userContextService
    ) {
        _playerMessageRepository = playerMessageRepository;
        _gameRepository = gameRepository;
        _userContextService = userContextService;
    }

    public async Task Handle(SendDrawMessageRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var game = await _gameRepository.GetById(request.GameId)
            ?? throw new NotFoundException("Game not found.");

        if (game.WhitePlayer.UserId != userId && game.BlackPlayer.UserId != userId)
            throw new UnauthorizedException("This is not user game.");


        var drawByWhite = await _playerMessageRepository.GetDrawMessage(game.WhitePlayerId);
        var drawByBlack = await _playerMessageRepository.GetDrawMessage(game.BlackPlayerId);

        if (drawByWhite is not null || drawByBlack is not null)
            throw new BadRequestException("Draw offer already exists.");


        var playerId = game.WhitePlayer.UserId == userId ? game.WhitePlayerId : game.BlackPlayerId;
        var userPlayer = game.WhitePlayer.UserId == userId ? game.WhitePlayer : game.BlackPlayer;

        var message = new PlayerMessage()
        {
            Id = Guid.NewGuid(),
            Content = $"{userPlayer.Name} offered a draw.",
            PlayerId = playerId,
            Type = MessageType.DrawAction,
        };


        await _playerMessageRepository.Create(message);
    }
}
