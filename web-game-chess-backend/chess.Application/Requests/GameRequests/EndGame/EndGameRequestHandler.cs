

using chess.Application.Repositories;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.GameRequests.EndGame;

public class EndGameRequestHandler : IRequestHandler<EndGameRequest, EndGameDto> {

    private readonly IGameRepository _gameRepository;

    public EndGameRequestHandler(IGameRepository gameRepository) {
        _gameRepository = gameRepository;
    }   

    public async Task<EndGameDto> Handle(EndGameRequest request, CancellationToken cancellationToken) {

        var game = await _gameRepository.GetById(request.GameId) 
            ?? throw new NotFoundException("Game not found.");

        game.HasEnded = true;
        game.EndGameType = request.EndGameType;

        if(game.WhitePlayer.Color == request.LoserColor) {
            game.WinnerColor = game.BlackPlayer.Color;
        } else if(game.BlackPlayer.Color == request.LoserColor) {
            game.WinnerColor = game.WhitePlayer.Color;
        }

        game.WhitePlayer.FinishedGame = true;
        game.BlackPlayer.FinishedGame = true;

        await _gameRepository.Update(game);

        var endGameDto = new EndGameDto()
        {
            WinnerColor = game.WinnerColor,
        };

        return endGameDto;

    }
}
