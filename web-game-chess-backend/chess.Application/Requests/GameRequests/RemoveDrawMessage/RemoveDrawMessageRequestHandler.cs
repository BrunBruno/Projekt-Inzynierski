
using chess.Application.Repositories;
using chess.Application.Services;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.GameRequests.RemoveDrawMessage;

/// <summary>
/// Checks if game for provided id exists
/// Checks if user belong to the game
/// Checks if draw offer already exists
/// Removes draw offer if exists
/// </summary>
public class RemoveDrawMessageRequestHandler : IRequestHandler<RemoveDrawMessageRequest> {

    private readonly IPlayerMessageRepository _messageRepository;
    private readonly IGameRepository _gameRepository;
    private readonly IUserContextService _userContextService;

    public RemoveDrawMessageRequestHandler(
        IPlayerMessageRepository messageRepository,
        IGameRepository gameRepository,
        IUserContextService userContextService
    ) {
        _messageRepository = messageRepository;
        _gameRepository = gameRepository;
        _userContextService = userContextService;
    }

    public async Task Handle(RemoveDrawMessageRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var game = await _gameRepository.GetById(request.GameId)
            ?? throw new NotFoundException("Game not found.");

        if (game.WhitePlayer.UserId != userId && game.BlackPlayer.UserId != userId)
            throw new UnauthorizedException("This is not user player.");


        var drawByWhite = await _messageRepository.GetDrawMessage(game.WhitePlayerId);
        var drawByBlack = await _messageRepository.GetDrawMessage(game.BlackPlayerId);

        if (drawByWhite is null && drawByBlack is null)
            throw new BadRequestException("Draw offer not exists.");


        if(drawByWhite is not null) {
            await _messageRepository.Delete(drawByWhite);
        }

        if(drawByBlack is not null) {
            await _messageRepository.Delete(drawByBlack);
        }
    }
}
