
using chess.Application.Repositories;
using chess.Core.Entities;
using chess.Core.Enums;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.GameRequests.SendGameMessage;

/// <summary>
/// Checks if game for provided id exists
/// Creates new game message
/// </summary>
public class SendGameMessageRequestHandler : IRequestHandler<SendGameMessageRequest> {

    private readonly IGameMessageRepository _gameMessageRepository;
    private readonly IGameRepository _gameRepository;

    public SendGameMessageRequestHandler(
        IGameMessageRepository gameMessageRepository,
        IGameRepository gameRepository
    ) {
        _gameMessageRepository = gameMessageRepository;
        _gameRepository = gameRepository;
    }

    public async Task Handle(SendGameMessageRequest request, CancellationToken cancellationToken) {

        var game = await _gameRepository.GetById(request.GameId)
            ?? throw new NotFoundException("Game not found.");


        var message = new GameMessage()
        {
            Id = Guid.NewGuid(),
            RequestorName = "BOT",
            Content = request.Message,
            Type = MessageType.Bot,
            GameId = game.Id
        };


        await _gameMessageRepository.Create(message);
    }
}
