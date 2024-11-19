
using chess.Application.Repositories.WebGameRepositories;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Core.Enums;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.WebGameRequests.SendPlayerMessage;

/// <summary>
/// Checks is game for provided id exists
/// Checks if current user belongs to game
/// Creates new message
/// </summary>
public class SendPlayerMessageRequestHandler : IRequestHandler<SendPlayerMessageRequest> {

    private readonly IWebGamePlayerMessageRepository _playerMessageRepository;
    private readonly IWebGameRepository _webGameRepository;
    private readonly IUserContextService _userContextService;

    public SendPlayerMessageRequestHandler(
        IWebGamePlayerMessageRepository playerMessageRepository,
        IWebGameRepository gameRepository,
        IUserContextService userContextService
    ) {
        _playerMessageRepository = playerMessageRepository;
        _webGameRepository = gameRepository;
        _userContextService = userContextService;
    }

    public async Task Handle(SendPlayerMessageRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var game = await _webGameRepository.GetById(request.GameId)
            ?? throw new NotFoundException("Game not found.");

        if(game.WhitePlayer.UserId != userId && game.BlackPlayer.UserId != userId)
            throw new UnauthorizedException("This is not user player.");


        var playerId = game.WhitePlayer.UserId == userId ? game.WhitePlayerId : game.BlackPlayerId;

        var message = new WebGamePlayerMessage()
        {
            Id = Guid.NewGuid(),
            Content = request.Message,
            PlayerId = playerId,
            Type = MessageType.Normal,
        };


        await _playerMessageRepository.Create(message);
    }
}
