
using chess.Application.Repositories;
using chess.Application.Services;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.GameRequests.EndGame;

public class EndGameRequestHandler : IRequestHandler<EndGameRequest, EndGameDto> {

    private readonly IGameRepository _gameRepository;
    private readonly IUserContextService _userContextService;

    public EndGameRequestHandler(IGameRepository gameRepository, IUserContextService userContextService) {
        _gameRepository = gameRepository;
        _userContextService = userContextService;
    }   

    public async Task<EndGameDto> Handle(EndGameRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var game = await _gameRepository.GetById(request.GameId) 
            ?? throw new NotFoundException("Game not found.");

        if (game.WhitePlayer.UserId != userId || game.BlackPlayer.UserId != userId)
            throw new UnauthorizedException("This is not user game.");

        if (game.HasEnded == true)
            throw new BadRequestException("Can not end already finished game.");

        game.HasEnded = true;
        game.EndGameType = request.EndGameType;

        if(game.WhitePlayer.Color == request.LoserColor) {
            game.WinnerColor = game.BlackPlayer.Color;
        } else if(game.BlackPlayer.Color == request.LoserColor) {
            game.WinnerColor = game.WhitePlayer.Color;
        } else {
            game.WinnerColor = null;
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
