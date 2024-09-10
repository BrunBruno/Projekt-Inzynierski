
using chess.Application.Repositories;
using chess.Application.Services;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.GameRequests.GetAllMessages;

/// <summary>
/// Checks if game exists
/// Checks if current user belongs to game
/// Gets all messages for player of current user
/// Returns messages list
/// </summary>
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
            throw new UnauthorizedException("This is not user game.");

        var messages = await _messageRepository.GetAllByPlayers(game.WhitePlayerId, game.BlackPlayerId);

        var messagesDtos = messages.Select(message => new GetAllMessagesDto() { 
            Message = message.Content,
            SenderName = message.Player.Name,
            SenderImage = message.Player.ImageUrl,
            SentAt = message.SentAt,
            Type = message.Type,
        }).ToList();

        return messagesDtos;
    }
}
