
using chess.Application.Repositories;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.GameRequests.MakeMove;

public class MakeMoveRequestHandler : IRequestHandler<MakeMoveRequest> {

    private readonly IGameRepository _gameRepository;
    private readonly IMoveRepository _moveRepository;
    private readonly IUserContextService _userContextService;

    public MakeMoveRequestHandler(
        IGameRepository gameRepository,
        IMoveRepository moveRepository,
        IUserContextService userContextService
    ) {
        _gameRepository = gameRepository;
        _moveRepository = moveRepository;
        _userContextService = userContextService;
    }

    public async Task Handle(MakeMoveRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var game = await _gameRepository.GetById(request.GameId) 
            ?? throw new NotFoundException("Game not found.");

        if (game.WhitePlayer.UserId != userId && game.BlackPlayer.UserId != userId)
            throw new UnauthorizedException("This is not user game.");

        if (game.HasEnded)
            throw new BadRequestException("Can not make move in finished game");

        if (game.Turn % 2 == 0) {
            game.WhitePlayer.TimeLeft = (request.WhiteSeconds / 60) + (game.GameTiming.Increment / 60);
        } else {
            game.BlackPlayer.TimeLeft = (request.BlackSeconds / 60) + (game.GameTiming.Increment / 60);
        }

        game.Position = request.Position;
        game.Round = (game.Turn / 2) + 1;
        game.Turn += 1;

        game.GameState.EnPassant = request.EnPassant;
        if (game.GameState.CanWhiteKingCastle) 
            game.GameState.CanWhiteKingCastle = !request.Wkm;
        if (game.GameState.CanWhiteShortRookCastle)
            game.GameState.CanWhiteShortRookCastle = !request.Wsrm;
        if (game.GameState.CanWhiteLongRookCastle)
            game.GameState.CanWhiteLongRookCastle = !request.Wlrm;
        if (game.GameState.CanBlackKingCastle)
            game.GameState.CanBlackKingCastle = !request.Bkm;
        if (game.GameState.CanBlackShortRookCastle)
            game.GameState.CanBlackShortRookCastle = !request.Bsrm;
        if (game.GameState.CanBlackLongRookCastle)
            game.GameState.CanBlackLongRookCastle = !request.Blrm;


        await _gameRepository.Update(game);


        var move = new Move()
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
