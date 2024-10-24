﻿
using chess.Application.Repositories;
using chess.Application.Services;
using chess.Core.Enums;
using chess.Core.Maps.MapOfElo;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.GameRequests.EndGame;

/// <summary>
/// Checks if game with provided id exists
/// Checks if current user was a participant of the game
/// If game has been finished returns end game dto
/// Gets both players
/// Gets friendship if game is private
/// Sets all parameters for users (stats and elo points) and games according to result of the game
/// Returns end game dto
/// </summary>
public class EndGameRequestHandler : IRequestHandler<EndGameRequest, EndGameDto> {

    private readonly IGameRepository _gameRepository;
    private readonly IUserContextService _userContextService;
    private readonly IUserRepository _userRepository;
    private readonly IFriendshipRepository _friendshipRepository;

    public EndGameRequestHandler(
        IGameRepository gameRepository,
        IUserContextService userContextService,
        IUserRepository userRepository,
         IFriendshipRepository friendshipRepository
    ) {
        _gameRepository = gameRepository;
        _userContextService = userContextService;
        _userRepository = userRepository;
        _friendshipRepository = friendshipRepository;
    }   

    public async Task<EndGameDto> Handle(EndGameRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        if((
            request.LoserColor == null && 
                (request.EndGameType == GameEndReason.CheckMate ||
                request.EndGameType == GameEndReason.OutOfTime ||
                request.EndGameType == GameEndReason.Resignation)
            ) || (
            request.LoserColor != null &&
                (request.EndGameType == GameEndReason.StaleMate ||
                request.EndGameType == GameEndReason.Threefold ||
                request.EndGameType == GameEndReason.Agreement ||
                request.EndGameType == GameEndReason.FiftyMovesRule ||
                request.EndGameType == GameEndReason.InsufficientMaterial)
            )){
            throw new BadRequestException("Incorrect game result.");
        }

        var game = await _gameRepository.GetById(request.GameId) 
            ?? throw new NotFoundException("Game not found.");

        if (game.WhitePlayer.UserId != userId && game.BlackPlayer.UserId != userId)
            throw new UnauthorizedException("This is not user game.");

        // game already has ended
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


        var friendship = game.IsPrivate == true ? await _friendshipRepository.GetByUsersIds(whiteUser.Id, blackUser.Id) : null;


        game.HasEnded = true;
        game.EndGameType = request.EndGameType;


        int whiteElo = whiteUser.Elo.GetElo(game.TimingType);
        int blackElo = blackUser.Elo.GetElo(game.TimingType);

        int eloDiff = Math.Abs(whiteElo - blackElo);
        int eloToUpdate;


        // updates stats and elos / white loses
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

            if(friendship is not null){
                if(friendship.RequestorId == whiteUser.Id) { 
                    friendship.RequestorLoses +=1;
                }

                if(friendship.RequestorId == blackUser.Id) {
                    friendship.RequestorWins +=1;
                }
            }

            switch (request.EndGameType) {
                case GameEndReason.CheckMate:

                    whiteUser.Stats.LosesByCheckMate += 1;
                    blackUser.Stats.WinsByCheckMate += 1;

                    break;
                case GameEndReason.OutOfTime:

                    whiteUser.Stats.LosesByTimeout += 1;
                    blackUser.Stats.WinsByTimeout += 1;

                    break;
                case GameEndReason.Resignation:

                    whiteUser.Stats.LosesByResignation += 1;
                    blackUser.Stats.WinsByResignation += 1;

                    break;
            }

        // updates stats and elos / black loses
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

            if(friendship is not null){
                if(friendship.RequestorId == whiteUser.Id) { 
                    friendship.RequestorWins +=1;
                }
                
                if(friendship.RequestorId == blackUser.Id) {
                    friendship.RequestorLoses +=1;
                }
            }

            switch (request.EndGameType) {
                case GameEndReason.CheckMate:

                    whiteUser.Stats.WinsByCheckMate += 1;
                    blackUser.Stats.LosesByCheckMate += 1;

                    break;
                case GameEndReason.OutOfTime:

                    whiteUser.Stats.WinsByTimeout += 1;
                    blackUser.Stats.LosesByTimeout += 1;

                    break;
                case GameEndReason.Resignation:

                    whiteUser.Stats.WinsByResignation += 1;
                    blackUser.Stats.LosesByResignation += 1;

                    break;
            }

        // updates stats and elos / draw
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

            if(friendship is not null){
                friendship.RequestorDraws += 1;
            }
        }

        game.EloGain = eloToUpdate;

        game.WhitePlayer.FinishedGame = true;
        game.BlackPlayer.FinishedGame = true;
        game.EndedAt = DateTime.UtcNow;


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
