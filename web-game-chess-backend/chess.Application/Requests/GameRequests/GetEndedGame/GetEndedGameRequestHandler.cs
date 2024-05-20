
using chess.Application.Repositories;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.GameRequests.GetEndedGame;

public class GetEndedGameRequestHandler : IRequestHandler<GetEndedGameRequest, GetEndedGameDto> {

    private readonly IGameRepository _gameRepository;

    public GetEndedGameRequestHandler(IGameRepository gameRepository) { 
        _gameRepository = gameRepository;
    }

    public async Task<GetEndedGameDto> Handle(GetEndedGameRequest request, CancellationToken cancellationToken) {
        var game = await _gameRepository.GetById(request.GameId)
            ?? throw new NotFoundException("Game not found.");

        await _gameRepository.Update(game);

        var endedGameDto = new GetEndedGameDto()
        {
            WinnerColor = game.WinnerColor,
        };

        return endedGameDto;
    }
}
