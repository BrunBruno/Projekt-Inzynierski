
using chess.Application.Repositories;
using chess.Application.Services;
using chess.Core.Dtos;
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
    private readonly IPlayerMessageRepository _messageRepository;
    private readonly IUserContextService _userContextService;
    private readonly IUserImageRepository _userImageRepository;

    public GetAllMessagesRequestHandler(
        IGameRepository gameRepository,
        IPlayerMessageRepository messageRepository,
        IUserContextService userContextService,
        IUserImageRepository userImageRepository
    ) {
        _gameRepository = gameRepository;
        _messageRepository = messageRepository;
        _userContextService = userContextService;
        _userImageRepository = userImageRepository;
    }

    public async Task<List<GetAllMessagesDto>> Handle(GetAllMessagesRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var game = await _gameRepository.GetById(request.GameId)
            ?? throw new NotFoundException("Game not found.");

        if (game.WhitePlayer.UserId != userId && game.BlackPlayer.UserId != userId)
            throw new UnauthorizedException("This is not user game.");

        var messages = await _messageRepository.GetAllByPlayers(game.WhitePlayerId, game.BlackPlayerId);

        var whitePlayerImage = await _userImageRepository.GetByUserId(game.WhitePlayer.UserId);
        var blackPlayerImage = await _userImageRepository.GetByUserId(game.BlackPlayer.UserId);

        var messagesDtos = messages.Select(message => new GetAllMessagesDto() { 
            Message = message.Content,
            SenderName = message.Player.Name,
            SentAt = message.SentAt,
            Type = message.Type,

            SenderImage = whitePlayerImage != null && whitePlayerImage.UserId == message.Player.UserId ? new ImageDto() 
            {
                Data = whitePlayerImage.Data,
                ContentType = whitePlayerImage.ContentType,
            } : blackPlayerImage != null && blackPlayerImage.UserId == message.Player.UserId ? new ImageDto()
            {
                Data = blackPlayerImage.Data,
                ContentType = blackPlayerImage.ContentType,
            } : null,
        }).ToList();

        return messagesDtos;
    }
}
