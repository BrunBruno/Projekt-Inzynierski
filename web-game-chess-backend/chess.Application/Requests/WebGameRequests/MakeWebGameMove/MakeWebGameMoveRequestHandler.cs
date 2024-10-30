
using chess.Application.Repositories.WebGameRepositories;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.WebGameRequests.MakeWebGameMove;

/// <summary>
/// Checks if current game exists
/// Checks if current user belongs to game
/// Checks if game is still ongoing
/// Checks if game was started properly
/// Sets all states of the game
/// Creates new move
/// </summary>
public class MakeWebGameMoveRequestHandler : IRequestHandler<MakeWebGameMoveRequest> {

    private readonly IWebGameRepository _gameRepository;
    private readonly IWebGameMoveRepository _moveRepository;
    private readonly IUserContextService _userContextService;

    public MakeWebGameMoveRequestHandler(
        IWebGameRepository gameRepository,
        IWebGameMoveRepository moveRepository,
        IUserContextService userContextService
    ) {
        _gameRepository = gameRepository;
        _moveRepository = moveRepository;
        _userContextService = userContextService;
    }

    public async Task Handle(MakeWebGameMoveRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var game = await _gameRepository.GetById(request.GameId) 
            ?? throw new NotFoundException("Game not found.");

        if (game.WhitePlayer.UserId != userId && game.BlackPlayer.UserId != userId)
            throw new UnauthorizedException("This is not user game.");

        if (game.HasEnded)
            throw new BadRequestException("Can not make move in finished game");

        DateTime lastTimeRecorded = (game.Moves.Count == 0 ? game.StartedAt : game.Moves[^1].DoneAt)
          ?? throw new BadRequestException("Game was not started properly.");

        double timeDifference = (DateTime.UtcNow - lastTimeRecorded).TotalSeconds;

        if (game.Turn % 2 == 0) {
            game.WhitePlayer.TimeLeft -= timeDifference;
            game.WhitePlayer.TimeLeft += game.GameTiming.Increment;
        } else {
            game.BlackPlayer.TimeLeft -= timeDifference;
            game.BlackPlayer.TimeLeft += game.GameTiming.Increment;
        }

        game.Position = request.Position;
        game.Round = (game.Turn / 2) + 1;
        game.Turn += 1;

        game.CurrentState.EnPassant = request.EnPassant;
        if (game.CurrentState.CanWhiteKingCastle) 
            game.CurrentState.CanWhiteKingCastle = !request.WhitekingMoved;
        if (game.CurrentState.CanWhiteShortRookCastle)
            game.CurrentState.CanWhiteShortRookCastle = !request.WhiteShortRookMoved;
        if (game.CurrentState.CanWhiteLongRookCastle)
            game.CurrentState.CanWhiteLongRookCastle = !request.WhiteLongRookMoved;
        if (game.CurrentState.CanBlackKingCastle)
            game.CurrentState.CanBlackKingCastle = !request.BlackKingMoved;
        if (game.CurrentState.CanBlackShortRookCastle)
            game.CurrentState.CanBlackShortRookCastle = !request.BlackShortRookMoved;
        if (game.CurrentState.CanBlackLongRookCastle)
            game.CurrentState.CanBlackLongRookCastle = !request.BlackLongRookMoved;


        await _gameRepository.Update(game);


        var move = new WebGameMove()
        {
            Id = Guid.NewGuid(),
            DoneMove = request.Move,
            OldCoordinates = request.OldCoor,
            NewCoordinates = request.NewCoor,
            CapturedPiece = request.CapturedPiece,
            Position = game.Position,
            Turn = game.Turn,
            WhiteTime = game.WhitePlayer.TimeLeft,
            BlackTime = game.BlackPlayer.TimeLeft,
            GameId = game.Id,
        };


        await _moveRepository.Create(move);
    }
}
