
using chess.Application.Repositories.EngineGameRepositories;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Core.Enums;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.EngineRequests.EndEngineGame;

/// <summary>
/// Gets game and checks if user is player of game
/// Checks if game has not been already ended
/// Creates ending message
/// Updates game properties
/// Returns end game dto
/// </summary>
public class EndEngineGameRequestHandler : IRequestHandler<EndEngineGameRequest, EndEngineGameDto> {

    private readonly IEngineGameRepository _engineGameRepository;
    private readonly IUserContextService _userContextService;
    private readonly IEngineGameMessageRepository _engineGameMessageRepository;

    public EndEngineGameRequestHandler(
        IEngineGameRepository engineGameRepository,
        IUserContextService userContextService,
        IEngineGameMessageRepository engineGameMessageRepository
    ) { 
        _engineGameRepository = engineGameRepository;
        _userContextService = userContextService;
        _engineGameMessageRepository = engineGameMessageRepository;
    }

    public async Task<EndEngineGameDto> Handle(EndEngineGameRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var game = await _engineGameRepository.GetById(request.GameId)
            ?? throw new NotFoundException("Game not found.");

        if (game.Player.UserId != userId)
            throw new UnauthorizedException("Not user game.");

        // game already ended
        if (game.HasEnded == true) {
            var prevDto = new EndEngineGameDto()
            {
                WinnerColor = game.WinnerColor,
            };

            return prevDto;
        }

        game.HasEnded = true;
        game.EndedAt = DateTime.UtcNow;
        game.IsWinner = request.LoserColor != game.Player.Color;
        game.WinnerColor = request.LoserColor == PieceColor.White ? PieceColor.Black : request.LoserColor == PieceColor.Black ? PieceColor.White : null;

        var endMessage = new EngineGameMessage() { 
            Id = Guid.NewGuid(),
            Content = "Game ended.",
            RequestorName = "BOT",
            Type = MessageType.Bot,
            GameId = game.Id,
        };


        await _engineGameMessageRepository.Create(endMessage);
        await _engineGameRepository.Update(game);


        var dto = new EndEngineGameDto()
        {
            WinnerColor = game.WinnerColor,
        };

        return dto;
    }
}
