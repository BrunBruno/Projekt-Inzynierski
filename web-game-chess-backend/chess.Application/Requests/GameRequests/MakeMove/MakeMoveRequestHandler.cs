
using chess.Application.Repositories;
using chess.Core.Entities;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.GameRequests.MakeMove;
public class MakeMoveRequestHandler : IRequestHandler<MakeMoveRequest> {

    private readonly IGameRepository _gameRepository;
    private readonly IMoveRepository _moveRepository;

    public MakeMoveRequestHandler(IGameRepository gameRepository, IMoveRepository moveRepository) {
        _gameRepository = gameRepository;
        _moveRepository = moveRepository;
    }

    public async Task Handle(MakeMoveRequest request, CancellationToken cancellationToken) {

        var game = await _gameRepository.GetById(request.GameId) 
            ?? throw new NotFoundException("Game not found.");

        if (game.Turn % 2 == 0) {
            game.WhitePlayer.TimeLeft += game.GameTiming.Increment / 60;
        } else {
            game.BlackPlayer.TimeLeft += game.GameTiming.Increment / 60;
        }

        game.Position = request.Position;
        game.Turn += 1;

        

        await _gameRepository.Update(game);

        var move = new Move()
        {
            Id = Guid.NewGuid(),
            DoneMove = request.DoneMove,
            Position = game.Position,
            Turn = game.Turn,
            WhiteTime = game.WhitePlayer.TimeLeft,
            BlackTime = game.BlackPlayer.TimeLeft,
            GameId = game.Id,
        };

        await _moveRepository.Create(move);
    }
}
