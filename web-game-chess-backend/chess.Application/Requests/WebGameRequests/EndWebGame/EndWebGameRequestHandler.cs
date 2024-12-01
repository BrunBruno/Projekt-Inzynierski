
using chess.Application.Repositories.FriendshipRepositories;
using chess.Application.Repositories.UserRepositories;
using chess.Application.Repositories.WebGameRepositories;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Core.Enums;
using chess.Core.Maps.MapOfElo;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.WebGameRequests.EndWebGame;

/// <summary>
/// Checks if game with provided id exists
/// Checks if current user was a participant of the game
/// Gets both players
/// Gets friendship if game is private
/// Sets all parameters for users (stats and elo points) and games according to result of the game
/// </summary>
public class EndWebGameRequestHandler : IRequestHandler<EndWebGameRequest> {

    private readonly IWebGameRepository _webGameRepository;
    private readonly IUserContextService _userContextService;
    private readonly IUserRepository _userRepository;
    private readonly IFriendshipRepository _friendshipRepository;
    private readonly IWebGameMessageRepository _webGameMessageRepository;

    public EndWebGameRequestHandler(
        IWebGameRepository webGameRepository,
        IUserContextService userContextService,
        IUserRepository userRepository,
        IFriendshipRepository friendshipRepository,
        IWebGameMessageRepository webGameMessageRepository
    ) {
        _webGameRepository = webGameRepository;
        _userContextService = userContextService;
        _userRepository = userRepository;
        _friendshipRepository = friendshipRepository;
        _webGameMessageRepository = webGameMessageRepository;
    }   

    public async Task Handle(EndWebGameRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var game = await _webGameRepository.GetById(request.GameId)
            ?? throw new NotFoundException("Game not found");

        if (game.WhitePlayer.UserId != userId && game.BlackPlayer.UserId != userId)
            throw new UnauthorizedException("Not user game");

        if (game.HasEnded)
            throw new BadRequestException("Game is finished");
      

        if ((
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
            throw new BadRequestException("Incorrect game result");
        }


        var whiteUser = await _userRepository.GetById(game.WhitePlayer.UserId) 
            ?? throw new NotFoundException("User not found");

        var blackUser = await _userRepository.GetById(game.BlackPlayer.UserId)
           ?? throw new NotFoundException("User not found");


        var friendship = await _friendshipRepository.GetByUsersIds(whiteUser.Id, blackUser.Id);


        game.HasEnded = true;
        game.EndGameType = request.EndGameType;


        int whiteElo = whiteUser.Elo.GetElo(game.TimingType);
        int blackElo = blackUser.Elo.GetElo(game.TimingType);

        int eloDiff = Math.Abs(whiteElo - blackElo);
        int eloToUpdate;


        // updates stats and elo / white loses
        if (game.WhitePlayer.Color == request.LoserColor) {
            game.WinnerColor = game.BlackPlayer.Color;

            blackUser.Stats.OnlineWins += 1;
            whiteUser.Stats.OnlineLoses += 1;

            // elo
            if (whiteElo > blackElo) {

                eloToUpdate = (int)Math.Ceiling(0.1 * eloDiff + 10);

                whiteUser.Elo.UpdateElo(game.TimingType, -eloToUpdate);
                blackUser.Elo.UpdateElo(game.TimingType, eloToUpdate);

            } else {

                eloToUpdate = (int)Math.Ceiling(100 / (0.1 * eloDiff + 10));

                whiteUser.Elo.UpdateElo(game.TimingType, -eloToUpdate);
                blackUser.Elo.UpdateElo(game.TimingType, eloToUpdate);

            }

            // friendship
            if(friendship is not null){
                if(friendship.RequestorId == whiteUser.Id) { 
                    friendship.Stats.RequestorLoses +=1;
                }

                if(friendship.RequestorId == blackUser.Id) {
                    friendship.Stats.RequestorWins +=1;
                }
            }

            // other stats
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

            whiteUser.Stats.OnlineWins += 1;
            blackUser.Stats.OnlineLoses += 1;

            // elo
            if (blackElo > whiteElo) {

                eloToUpdate = (int)Math.Ceiling(0.1 * eloDiff + 10);

                whiteUser.Elo.UpdateElo(game.TimingType, eloToUpdate);
                blackUser.Elo.UpdateElo(game.TimingType, -eloToUpdate);

            } else {

                eloToUpdate = (int)Math.Ceiling(100 / (0.1 * eloDiff + 10));

                whiteUser.Elo.UpdateElo(game.TimingType, eloToUpdate);
                blackUser.Elo.UpdateElo(game.TimingType, -eloToUpdate);

            }

            // friendship stats
            if(friendship is not null){
                if(friendship.RequestorId == whiteUser.Id) { 
                    friendship.Stats.RequestorWins +=1;
                }
                
                if(friendship.RequestorId == blackUser.Id) {
                    friendship.Stats.RequestorLoses +=1;
                }
            }

            // other stats
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

            whiteUser.Stats.OnlineDraws += 1;
            blackUser.Stats.OnlineDraws += 1;


            eloToUpdate = (int)Math.Ceiling(0.05 * eloDiff);
            if (whiteElo > blackElo) {

                whiteUser.Elo.UpdateElo(game.TimingType, -eloToUpdate);
                blackUser.Elo.UpdateElo(game.TimingType, eloToUpdate);

            } else if (blackElo > whiteElo) {

                whiteUser.Elo.UpdateElo(game.TimingType, eloToUpdate);
                blackUser.Elo.UpdateElo(game.TimingType, -eloToUpdate);

            }

            if(friendship is not null){
                friendship.Stats.RequestorDraws += 1;
            }
        }


        // type stats
        switch (game.TimingType) {
            case TimingTypes.Bullet:
                whiteUser.Stats.BulletGamesPlayed += 1;
                blackUser.Stats.BulletGamesPlayed += 1;
                break;

            case TimingTypes.Blitz:
                whiteUser.Stats.BlitzGamesPlayed += 1;
                blackUser.Stats.BlitzGamesPlayed += 1;
                break;

            case TimingTypes.Rapid:
                whiteUser.Stats.RapidGamesPlayed += 1;
                blackUser.Stats.RapidGamesPlayed += 1;
                break;

            case TimingTypes.Classic:
                whiteUser.Stats.ClassicGamesPlayed += 1;
                blackUser.Stats.ClassicGamesPlayed += 1;
                break;

            case TimingTypes.Daily:
                whiteUser.Stats.DailyGamesPlayed += 1;
                blackUser.Stats.DailyGamesPlayed += 1;
                break;
        }


        game.EloGain = eloToUpdate;
        game.WhitePlayer.FinishedGame = true;
        game.BlackPlayer.FinishedGame = true;
        game.EndedAt = DateTime.UtcNow;


        if (request.EndGameType == GameEndReason.CheckMate && game.Moves.Count > 0) {
            string lastMove = game.Moves[^1].FenMove;
            game.Moves[^1].FenMove = lastMove[..^1] + "#";
        }

        var winner = request.LoserColor == PieceColor.White ? game.BlackPlayer.Name : game.WhitePlayer.Name;
        var loser = request.LoserColor == PieceColor.White ? game.WhitePlayer.Name : game.BlackPlayer.Name;

        var endMessages = new List<WebGameMessage>() { 
            new WebGameMessage(){
                Id = Guid.NewGuid(),
                RequestorName = "BOT",
                Content = $"Game over.",
                Type = MessageType.Bot,
                GameId = game.Id
            },

             new WebGameMessage(){
                Id = Guid.NewGuid(),
                RequestorName = "BOT",
                Content = "",
                Type = MessageType.Bot,
                GameId = game.Id
            },
        };


        switch (request.EndGameType) {

            case GameEndReason.CheckMate:
                endMessages[1].Content = $"Player {winner} wins by check mate.";
                break;

            case GameEndReason.Resignation:
                endMessages[1].Content = $"Player {loser} resigned.";
                break;

            case GameEndReason.OutOfTime:
                endMessages[1].Content = $"Player {loser} run out of time.";
                break;

            case GameEndReason.StaleMate:
                endMessages[1].Content = $"Game drawn by stalemate.";
                break;

            case GameEndReason.Agreement:
                endMessages[1].Content = $"Game drawn by agreement.";
                break;

            case GameEndReason.FiftyMovesRule:
                endMessages[1].Content = $"Game drawn by 50 move rule.";
                break;

            case GameEndReason.Threefold:
                endMessages[1].Content = $"Game drawn by repetion.";
                break;

            case GameEndReason.InsufficientMaterial:
                endMessages[1].Content = $"Game drawn by insufficient meterial.";
                break;
        }


        await _webGameRepository.Update(game);
        await _userRepository.Update(whiteUser);
        await _userRepository.Update(blackUser);
        await _webGameMessageRepository.CreateMany(endMessages);
    }
}
