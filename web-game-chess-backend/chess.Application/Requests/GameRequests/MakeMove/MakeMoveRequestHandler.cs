
using chess.Application.Repositories;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.GameRequests.MakeMove;
public class MakeMoveRequestHandler : IRequestHandler<MakeMoveRequest> {

    private readonly IGameRepository _gameRepository;

    public MakeMoveRequestHandler(IGameRepository gameRepository) {
        _gameRepository = gameRepository;
    }

    public async Task Handle(MakeMoveRequest request, CancellationToken cancellationToken) {

        var game = await _gameRepository.GetById(request.GameId) 
            ?? throw new NotFoundException("Game not found.");

        game.Position = request.Position;
        game.Turn += 1;

        await _gameRepository.Update(game);

    }
}
