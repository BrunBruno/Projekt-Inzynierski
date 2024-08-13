
using chess.Application.Repositories;
using chess.Application.Services;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.GameRequests.GetAllMessages;

public class GetAllMessagesRequestHandler : IRequestHandler<GetAllMessagesRequest, List<GetAllMessagesDto>> {

    private readonly IGameRepository _gameRepository;
    private readonly IMessageRepository _messageRepository;
    private readonly IUserContextService _userContextService;

    public GetAllMessagesRequestHandler(
        IGameRepository gameRepository,
        IMessageRepository messageRepository,
        IUserContextService userContextService
    ) {
        _gameRepository = gameRepository;
        _messageRepository = messageRepository;
        _userContextService = userContextService;
    }

    public async Task<List<GetAllMessagesDto>> Handle(GetAllMessagesRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var game = await _gameRepository.GetById(request.GameId)
            ?? throw new NotFoundException("Game not found.");

        if (game.WhitePlayer.UserId != userId && game.BlackPlayer.UserId != userId)
            throw new BadRequestException("This is not user game.");

        var messages = await _messageRepository.GetAllByPlayers(game.WhitePlayerId, game.BlackPlayerId);

        var messagesDtos = messages.Select(message => new GetAllMessagesDto() { 
            Message = message.Content,
            SenderName = message.Player.Name,
            SenderImage = message.Player.ImageUrl,
            SentAt = message.SentAt,
        }).ToList();

        return messagesDtos;
    }
}
