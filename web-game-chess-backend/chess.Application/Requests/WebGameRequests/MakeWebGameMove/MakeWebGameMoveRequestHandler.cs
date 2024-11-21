
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

    private readonly IWebGameRepository _webGameRepository;
    private readonly IWebGameMoveRepository _moveRepository;
    private readonly IUserContextService _userContextService;

    public MakeWebGameMoveRequestHandler(
        IWebGameRepository gameRepository,
        IWebGameMoveRepository moveRepository,
        IUserContextService userContextService
    ) {
        _webGameRepository = gameRepository;
        _moveRepository = moveRepository;
        _userContextService = userContextService;
    }

    public async Task Handle(MakeWebGameMoveRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var game = await _webGameRepository.GetById(request.GameId) 
            ?? throw new NotFoundException("Game not found.");

        if (game.HasEnded)
            throw new BadRequestException("Game is finished.");

        if (game.WhitePlayer.UserId != userId && game.BlackPlayer.UserId != userId)
            throw new UnauthorizedException("Not user game.");


        // update times
        DateTime lastTimeRecorded = (game.Moves.Count == 0 ? game.StartedAt : game.Moves[^1].DoneAt)
          ?? throw new BadRequestException("Game starting error.");

        double timeDifference = (DateTime.UtcNow - lastTimeRecorded).TotalSeconds;

        if (game.Turn % 2 == 0) {
            game.WhitePlayer.TimeLeft -= timeDifference;
            game.WhitePlayer.TimeLeft += game.GameTiming.Increment;
        } else {
            game.BlackPlayer.TimeLeft -= timeDifference;
            game.BlackPlayer.TimeLeft += game.GameTiming.Increment;
        }


        // update states
        game.CurrentState.EnPassant = request.EnPassant;
        if (game.CurrentState.CanWhiteKingCastle) 
            game.CurrentState.CanWhiteKingCastle = !request.WhiteKingMoved;
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


        // update game
        game.Position = request.Position;
        game.Round = (game.Turn / 2) + 1;
        game.Turn += 1;

        if(request.Move[0] == 'p' || request.Move[0] == 'P') game.CurrentState.HalfMove = 0;
        else game.CurrentState.HalfMove += 1;


        var move = new WebGameMove()
        {
            Id = Guid.NewGuid(),
            DoneMove = request.Move,
            FenMove = request.FenMove,
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
        await _webGameRepository.Update(game);
    }
}
