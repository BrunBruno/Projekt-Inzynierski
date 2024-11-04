﻿
using chess.Application.Repositories.EngineGameRepositories;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.EngineRequests.MakeEngineGameMove;

public class MakeEngineGameMoveRequestHandler : IRequestHandler<MakeEngineGameMoveRequest> {

    private readonly IUserContextService _userContextService;
    private readonly IEngineGameRepository _engineGameRepository;
    private readonly IEngineGameMoveRepository _engineGameMoveRepository;

    public MakeEngineGameMoveRequestHandler(
        IUserContextService userContextService,
        IEngineGameRepository engineGameRepository,
        IEngineGameMoveRepository engineGameMoveRepository
    ) {
        _userContextService = userContextService;
        _engineGameRepository = engineGameRepository;
        _engineGameMoveRepository = engineGameMoveRepository;
    }

    public async Task Handle(MakeEngineGameMoveRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var game = await _engineGameRepository.GetById(request.GameId)
            ?? throw new NotFoundException("Game not found.");

        if (game.HasEnded)
            throw new BadRequestException("Game is finished.");

        if(game.Player.UserId != userId)
            throw new UnauthorizedException("Not user game.");

        // update times
        /*
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
        */


        // update states
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


        // update game
        game.Position = request.Position;
        game.Round = (game.Turn / 2) + 1;
        game.Turn += 1;

        var playerMove = new EngineGameMove()
        {
            Id = Guid.NewGuid(),
            DoneMove = request.Move,
            FenMove = request.FenMove, 
            Position = game.Position,
            OldCoordinates = request.OldCoor,
            NewCoordinates = request.NewCoor,
            Turn = game.Turn,
            CapturedPiece = request.CapturedPiece,
            //WhiteTime = game.WhitePlayer.TimeLeft,
            //BlackTime = game.BlackPlayer.TimeLeft,
            GameId = game.Id,
        };


        await _engineGameMoveRepository.Create(playerMove);
        await _engineGameRepository.Update(game);
    }
}
