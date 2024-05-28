
using chess.Application.Repositories;
using chess.Application.Services;
using chess.Core.Extensions;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.GameRequests.EndGame;

public class EndGameRequestHandler : IRequestHandler<EndGameRequest, EndGameDto> {

    private readonly IGameRepository _gameRepository;
    private readonly IUserContextService _userContextService;
    private readonly IUserRepository _userRepository;
    

    public EndGameRequestHandler(
        IGameRepository gameRepository,
        IUserContextService userContextService,
        IUserRepository userRepository
    ) {
        _gameRepository = gameRepository;
        _userContextService = userContextService;
        _userRepository = userRepository;
    }   

    public async Task<EndGameDto> Handle(EndGameRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var game = await _gameRepository.GetById(request.GameId) 
            ?? throw new NotFoundException("Game not found.");

        if (game.WhitePlayer.UserId != userId && game.BlackPlayer.UserId != userId)
            throw new UnauthorizedException("This is not user game.");

        if (game.HasEnded == true) {
            var finishedGameDto = new EndGameDto()
            {
                WinnerColor = game.WinnerColor,
            };

            return finishedGameDto;
        }
            //throw new BadRequestException("Can not end already finished game.");

        var whiteUser = await _userRepository.GetById(game.WhitePlayer.UserId) 
            ?? throw new NotFoundException("User not found");

        var blackUser = await _userRepository.GetById(game.BlackPlayer.UserId)
           ?? throw new NotFoundException("User not found");

        game.HasEnded = true;
        game.EndGameType = request.EndGameType;

        if(game.WhitePlayer.Color == request.LoserColor) {
            game.WinnerColor = game.BlackPlayer.Color;

            blackUser.Elo.UpdateElo(game.TimingType, 10); // 10 ???
            whiteUser.Elo.UpdateElo(game.TimingType, -10); // 10 ???

        } else if(game.BlackPlayer.Color == request.LoserColor) {
            game.WinnerColor = game.WhitePlayer.Color;

            whiteUser.Elo.UpdateElo(game.TimingType, 10); // 10 ???
            blackUser.Elo.UpdateElo(game.TimingType, -10); // 10 ???

        } else {
            game.WinnerColor = null;
        }

        game.WhitePlayer.FinishedGame = true;
        game.BlackPlayer.FinishedGame = true;


        await _gameRepository.Update(game);

        await _userRepository.Update(whiteUser);
        await _userRepository.Update(blackUser);

        var endGameDto = new EndGameDto()
        {
            WinnerColor = game.WinnerColor,
        };

        return endGameDto;

    }
}
