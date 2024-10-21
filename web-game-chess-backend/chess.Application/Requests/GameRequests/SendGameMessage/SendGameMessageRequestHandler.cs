
using chess.Application.Repositories;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Core.Enums;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.GameRequests.SendGameMessage;

/// <summary>
///
/// </summary>
public class SendGameMessageRequestHandler : IRequestHandler<SendGameMessageRequest> {

    private readonly IGameMessageRepository _gameMessageRepository;
    private readonly IGameRepository _gameRepository;
    private readonly IUserContextService _userContextService;

    public SendGameMessageRequestHandler(
        IGameMessageRepository gameMessageRepository,
        IGameRepository gameRepository,
        IUserContextService userContextService
    ) {
        _gameMessageRepository = gameMessageRepository;
        _gameRepository = gameRepository;
        _userContextService = userContextService;
    }

    public async Task Handle(SendGameMessageRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var game = await _gameRepository.GetById(request.GameId)
            ?? throw new NotFoundException("Game not found.");


        var message = new GameMessage()
        {
            Id = Guid.NewGuid(),
            RequestorName = "BOT",
            Content = request.Message,
            Type = MessageType.Bot,
            GameId = request.GameId
        };


        await _gameMessageRepository.Create(message);
    }
}
