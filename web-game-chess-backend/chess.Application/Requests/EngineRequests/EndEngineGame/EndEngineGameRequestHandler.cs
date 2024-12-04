
using chess.Application.Repositories.EngineGameRepositories;
using chess.Application.Repositories.UserRepositories;
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
/// </summary>
public class EndEngineGameRequestHandler : IRequestHandler<EndEngineGameRequest> {

    private readonly IEngineGameRepository _engineGameRepository;
    private readonly IUserContextService _userContextService;
    private readonly IEngineGameMessageRepository _engineGameMessageRepository;
    private readonly IUserRepository _userRepository;

    public EndEngineGameRequestHandler(
        IEngineGameRepository engineGameRepository,
        IUserContextService userContextService,
        IEngineGameMessageRepository engineGameMessageRepository,
        IUserRepository userRepository
    ) { 
        _engineGameRepository = engineGameRepository;
        _userContextService = userContextService;
        _engineGameMessageRepository = engineGameMessageRepository;
        _userRepository = userRepository;
    }

    public async Task Handle(EndEngineGameRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var user = await _userRepository.GetById(userId)
            ?? throw new NotFoundException("User not found");

        var game = await _engineGameRepository.GetById(request.GameId)
            ?? throw new NotFoundException("Game not found");

        if (game.Player.UserId != userId)
            throw new UnauthorizedException("Not user game");

        if (game.HasEnded == true)
            throw new BadRequestException("Game is ended");



        if (game.Player.Color == request.LoserColor){

            user.Elo.Engine -= game.EngineLevel;
            user.Stats.OfflineLoses += 1;
            game.EloGain = -game.EngineLevel;

        } else if (request.LoserColor == null) {
            
            user.Elo.Engine += game.EngineLevel;
            user.Stats.OfflineDraws += 1;
            game.EloGain = game.EngineLevel;

        } else {

            user.Stats.OfflineWins += 1;
            game.EloGain = 0;
        }


        // end message
        var endMessage = new EngineGameMessage() { 
            Id = Guid.NewGuid(),
            Content = $"Game over.",
            RequestorName = "BOT",
            Type = MessageType.Bot,
            GameId = game.Id,
        };


        game.HasEnded = true;
        game.EndedAt = DateTime.UtcNow;
        game.WinnerColor = request.LoserColor == PieceColor.White ? PieceColor.Black : request.LoserColor == PieceColor.Black ? PieceColor.White : null;


        // update last move to check mate
        if (request.IsCheckMate && game.Moves.Count > 0) {
            string lastMove = game.Moves[^1].FenMove;
            game.Moves[^1].FenMove = lastMove[..^1] + "#";
        }


        await _engineGameMessageRepository.Create(endMessage);
        await _engineGameRepository.Update(game);
    }
}
