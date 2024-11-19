
using chess.Application.Repositories.WebGameRepositories;
using chess.Core.Entities;
using chess.Core.Enums;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.WebGameRequests.SendWebGameMessage;

/// <summary>
/// Checks if game for provided id exists
/// Creates new game message
/// </summary>
public class SendWebGameMessageRequestHandler : IRequestHandler<SendWebGameMessageRequest> {

    private readonly IWebGameMessageRepository _gameMessageRepository;
    private readonly IWebGameRepository _webGameRepository;

    public SendWebGameMessageRequestHandler(
        IWebGameMessageRepository gameMessageRepository,
        IWebGameRepository gameRepository
    ) {
        _gameMessageRepository = gameMessageRepository;
        _webGameRepository = gameRepository;
    }

    public async Task Handle(SendWebGameMessageRequest request, CancellationToken cancellationToken) {

        var game = await _webGameRepository.GetById(request.GameId)
            ?? throw new NotFoundException("Game not found.");


        var message = new WebGameMessage()
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
