
using chess.Application.Repositories;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.GameRequests.GetGame;

public class GetGameRequestHandler : IRequestHandler<GetGameRequest, GetGameDto> {

    private readonly IGameRepository _gameRepository;

    public GetGameRequestHandler(IGameRepository gameRepository) {
        _gameRepository = gameRepository;
    }

    public async Task<GetGameDto> Handle(GetGameRequest request, CancellationToken cancellationToken) {

        var game = await _gameRepository.GetById(request.GameId) 
            ?? throw new NotFoundException("Game not found.");

        var gameDto = new GetGameDto()
        {
            Position = game.Position,
            CreatedAt = game.CreatedAt,
            Duration = game.GameTiming.Minutes,
            Increment = game.GameTiming.Increment,

            WhitePlayer = new GetGamePlayerDto()
            {
                Name = game.WhitePlayer.Name,
                Elo = game.WhitePlayer.Elo,
            },

            BlackPlayer = new GetGamePlayerDto()
            {
                Name = game.BlackPlayer.Name,
                Elo = game.BlackPlayer.Elo,
            },
        };

        return gameDto;
    }
}
