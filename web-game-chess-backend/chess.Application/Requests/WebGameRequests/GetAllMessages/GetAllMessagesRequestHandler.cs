
using chess.Application.Repositories.UserRepositories;
using chess.Application.Repositories.WebGameRepositories;
using chess.Application.Services;
using chess.Core.Dtos;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.WebGameRequests.GetAllMessages;

/// <summary>
/// Checks if game exists
/// Checks if current user belongs to game
/// Gets all messages for player of current user
/// Returns messages list
/// </summary>
public class GetAllMessagesRequestHandler : IRequestHandler<GetAllMessagesRequest, List<GetAllMessagesDto>> {

    private readonly IWebGameRepository _webGameRepository;
    private readonly IWebGamePlayerMessageRepository _playerMessageRepository;
    private readonly IWebGameMessageRepository _gameMessageRepository;
    private readonly IUserContextService _userContextService;
    private readonly IUserProfileImageRepository _userImageRepository;

    public GetAllMessagesRequestHandler(
        IWebGameRepository gameRepository,
        IWebGamePlayerMessageRepository playerMessageRepository,
        IWebGameMessageRepository gameMessageRepository,
        IUserContextService userContextService,
        IUserProfileImageRepository userImageRepository
    ) {
        _webGameRepository = gameRepository;
        _playerMessageRepository = playerMessageRepository;
        _userContextService = userContextService;
        _userImageRepository = userImageRepository;
        _gameMessageRepository = gameMessageRepository;
    }

    public async Task<List<GetAllMessagesDto>> Handle(GetAllMessagesRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var game = await _webGameRepository.GetById(request.GameId)
            ?? throw new NotFoundException("Game not found.");

        if (game.WhitePlayer.UserId != userId && game.BlackPlayer.UserId != userId)
            throw new UnauthorizedException("This is not user game.");




        var gameMessages = await _gameMessageRepository.GetAll(request.GameId);

        var playerMessages = await _playerMessageRepository.GetAllByPlayers(game.WhitePlayerId, game.BlackPlayerId);

        var whitePlayerImage = await _userImageRepository.GetByUserId(game.WhitePlayer.UserId);
        var blackPlayerImage = await _userImageRepository.GetByUserId(game.BlackPlayer.UserId);


        var playerMessagesDtos = playerMessages.Select(message => new GetAllMessagesDto()
        {
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


        var gameMessagesDtos = gameMessages.Select(message => new GetAllMessagesDto() { 
            Message = message.Content,
            SenderName = "Chess BRN",
            SentAt = message.SentAt,
            Type = message.Type,
            RequestorName = message.RequestorName,
            SenderImage = null,
        }).ToList();


        // connect player messages and game messages
        var messagesDtos = playerMessagesDtos
                            .Concat(gameMessagesDtos)
                            .OrderBy(m => m.SentAt) 
                            .ToList();


        return messagesDtos;
    }
}
