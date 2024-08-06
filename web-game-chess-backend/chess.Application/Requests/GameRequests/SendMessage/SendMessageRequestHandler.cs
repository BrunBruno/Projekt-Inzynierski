
using chess.Application.Repositories;
using chess.Core.Entities;
using MediatR;

namespace chess.Application.Requests.GameRequests.SendMessage;

/// <summary>
/// Creates new message
/// </summary>
public class SendMessageRequestHandler : IRequestHandler<SendMessageRequest> {

    private readonly IMessageRepository _messageRepository;

    public SendMessageRequestHandler(IMessageRepository messageRepository) {
        _messageRepository = messageRepository;
    }

    public async Task Handle(SendMessageRequest request, CancellationToken cancellationToken) {

        throw new NotImplementedException();

        var message = new Message()
        {
            Id = Guid.NewGuid(),
            Content = request.Message,
            PlayerId = request.PlayerId,
        };

        await _messageRepository.Create(message);
    }
}
