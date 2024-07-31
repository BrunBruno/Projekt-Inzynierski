
using chess.Application.Repositories;
using chess.Application.Services;
using chess.Core.Enums;
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
                EloGain = game.EloGain,
            };

            return finishedGameDto;
        }


        var whiteUser = await _userRepository.GetById(game.WhitePlayer.UserId) 
            ?? throw new NotFoundException("User not found");

        var blackUser = await _userRepository.GetById(game.BlackPlayer.UserId)
           ?? throw new NotFoundException("User not found");


        game.HasEnded = true;
        game.EndGameType = request.EndGameType;


        int whiteElo = whiteUser.Elo.GetElo(game.TimingType);
        int blackElo = blackUser.Elo.GetElo(game.TimingType);

        int eloDiff = Math.Abs(whiteElo - blackElo);
        int eloToUpdate;


        if (game.WhitePlayer.Color == request.LoserColor) {
            game.WinnerColor = game.BlackPlayer.Color;

            blackUser.Stats.Wins += 1;
            whiteUser.Stats.Loses += 1;

            if (whiteElo > blackElo) {

                eloToUpdate = (int)Math.Ceiling(0.1 * eloDiff + 10);

                whiteUser.Elo.UpdateElo(game.TimingType, -eloToUpdate);
                blackUser.Elo.UpdateElo(game.TimingType, eloToUpdate);

            } else {

                eloToUpdate = (int)Math.Ceiling(100 / (0.1 * eloDiff + 10));

                whiteUser.Elo.UpdateElo(game.TimingType, -eloToUpdate);
                blackUser.Elo.UpdateElo(game.TimingType, eloToUpdate);

            }

            switch (request.EndGameType) {
                case EndGameTypes.CheckMate:

                    whiteUser.Stats.LosesByCheckMate += 1;
                    blackUser.Stats.WinsByCheckMate += 1;

                    break;
                case EndGameTypes.OutOfTime:

                    whiteUser.Stats.LosesByTimeout += 1;
                    blackUser.Stats.WinsByTimeout += 1;

                    break;
                case EndGameTypes.Resignation:

                    whiteUser.Stats.LosesByResignation += 1;
                    blackUser.Stats.WinsByResignation += 1;

                    break;
            }

        } else if(game.BlackPlayer.Color == request.LoserColor) {
            game.WinnerColor = game.WhitePlayer.Color;

            whiteUser.Stats.Wins += 1;
            blackUser.Stats.Loses += 1;

            if (blackElo > whiteElo) {

                eloToUpdate = (int)Math.Ceiling(0.1 * eloDiff + 10);

                whiteUser.Elo.UpdateElo(game.TimingType, eloToUpdate);
                blackUser.Elo.UpdateElo(game.TimingType, -eloToUpdate);

            } else {

                eloToUpdate = (int)Math.Ceiling(100 / (0.1 * eloDiff + 10));

                whiteUser.Elo.UpdateElo(game.TimingType, eloToUpdate);
                blackUser.Elo.UpdateElo(game.TimingType, -eloToUpdate);

            }

            switch (request.EndGameType) {
                case EndGameTypes.CheckMate:

                    whiteUser.Stats.WinsByCheckMate += 1;
                    blackUser.Stats.LosesByCheckMate += 1;

                    break;
                case EndGameTypes.OutOfTime:

                    whiteUser.Stats.WinsByTimeout += 1;
                    blackUser.Stats.LosesByTimeout += 1;

                    break;
                case EndGameTypes.Resignation:

                    whiteUser.Stats.WinsByResignation += 1;
                    blackUser.Stats.LosesByResignation += 1;

                    break;
            }

        } else {
            game.WinnerColor = null;

            whiteUser.Stats.Draws += 1;
            blackUser.Stats.Draws += 1;


            eloToUpdate = (int)Math.Ceiling(0.05 * eloDiff);
            if (whiteElo > blackElo) {

                whiteUser.Elo.UpdateElo(game.TimingType, -eloToUpdate);
                blackUser.Elo.UpdateElo(game.TimingType, eloToUpdate);

            } else if (blackElo > whiteElo) {

                whiteUser.Elo.UpdateElo(game.TimingType, eloToUpdate);
                blackUser.Elo.UpdateElo(game.TimingType, -eloToUpdate);

            }

        }

        game.EloGain = eloToUpdate;

        game.WhitePlayer.FinishedGame = true;
        game.BlackPlayer.FinishedGame = true;


        await _gameRepository.Update(game);
        await _userRepository.Update(whiteUser);
        await _userRepository.Update(blackUser);


        var endGameDto = new EndGameDto()
        {
            WinnerColor = game.WinnerColor,
            EloGain = eloToUpdate,
        };

        return endGameDto;

    }
}
