
using chess.Application.Repositories.FriendshipRepositories;
using chess.Application.Repositories.UserRepositories;
using chess.Application.Repositories.WebGameRepositories;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Core.Enums;
using chess.Shared.Exceptions;
using chess.Core.Maps.MapOfElo;

namespace chess.Infrastructure.Services;

public class WebGameFinisherService : IWebGamesFinisherService {

    private readonly IWebGameRepository _webGameRepository;
    private readonly IUserRepository _userRepository;
    private readonly IFriendshipRepository _friendshipRepository;
    private readonly IWebGameMessageRepository _webGameMessageRepository;

    public WebGameFinisherService(
        IWebGameRepository webGameRepository,
        IUserRepository userRepository,
        IFriendshipRepository friendshipRepository,
        IWebGameMessageRepository webGameMessageRepository
    ) {
        _webGameRepository = webGameRepository;
        _userRepository = userRepository;
        _friendshipRepository = friendshipRepository;
        _webGameMessageRepository = webGameMessageRepository;
    }

    ///<inheritdoc/>
    public async Task FinishGames() {

        var games = await _webGameRepository.GetAllOngoing();

        foreach (var game in games) {

            var loserColor = GetLoserColorIfOutOfTime(game);

            if (loserColor != null) {
                await EndGame(game, (PieceColor)loserColor);
            }
        }
    }

    private static PieceColor? GetLoserColorIfOutOfTime(WebGame game) {

        var lastTimeRecorded = (game.Moves == null || game.Moves.Count == 0) ? game.StartedAt : game.Moves[^1].DoneAt;

        if (lastTimeRecorded is null)
            return null;


        var currentTime = DateTime.UtcNow;
        var timeDifference = (currentTime - lastTimeRecorded.Value).TotalSeconds;


        double whiteTimeLeft;
        double blackTimeLeft;

        if (game.Turn % 2 == 0) {

            whiteTimeLeft = game.WhitePlayer.TimeLeft - timeDifference;

            if (whiteTimeLeft <= 0)
                return PieceColor.White;
            
        } else {

            blackTimeLeft = game.BlackPlayer.TimeLeft - timeDifference;

            if (blackTimeLeft <= 0) 
                return PieceColor.Black;

        }

        return null;
    }

    private async Task EndGame(WebGame game, PieceColor loserColor) {

        var whiteUser = await _userRepository.GetById(game.WhitePlayer.UserId)
            ?? throw new NotFoundException("User not found");

        var blackUser = await _userRepository.GetById(game.BlackPlayer.UserId)
           ?? throw new NotFoundException("User not found");


        var friendship = await _friendshipRepository.GetByUsersIds(whiteUser.Id, blackUser.Id);


        game.HasEnded = true;
        game.EndGameType = GameEndReason.OutOfTime;


        int whiteElo = whiteUser.Elo.GetElo(game.TimingType);
        int blackElo = blackUser.Elo.GetElo(game.TimingType);

        int eloDiff = Math.Abs(whiteElo - blackElo);
        int eloToUpdate;


        // updates stats and elo / white loses
        if (game.WhitePlayer.Color == loserColor) {
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
            if (friendship is not null) {
                if (friendship.RequestorId == whiteUser.Id) {
                    friendship.Stats.RequestorLoses += 1;
                }

                if (friendship.RequestorId == blackUser.Id) {
                    friendship.Stats.RequestorWins += 1;
                }
            }


            whiteUser.Stats.LosesByTimeout += 1;
            blackUser.Stats.WinsByTimeout += 1;

            // updates stats and elos / black loses
        } else if (game.BlackPlayer.Color == loserColor) {
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
            if (friendship is not null) {
                if (friendship.RequestorId == whiteUser.Id) {
                    friendship.Stats.RequestorWins += 1;
                }

                if (friendship.RequestorId == blackUser.Id) {
                    friendship.Stats.RequestorLoses += 1;
                }
            }


            whiteUser.Stats.WinsByTimeout += 1;
            blackUser.Stats.LosesByTimeout += 1;

            // updates stats and elos / draw
        } else {
            eloToUpdate = 0;
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



        var winner = loserColor == PieceColor.White ? game.BlackPlayer.Name : game.WhitePlayer.Name;
        var loser = loserColor == PieceColor.White ? game.WhitePlayer.Name : game.BlackPlayer.Name;

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
                Content = $"Player {loser} run out of time.",
                Type = MessageType.Bot,
                GameId = game.Id
            },
        };


        await _webGameRepository.Update(game);
        await _userRepository.Update(whiteUser);
        await _userRepository.Update(blackUser);
        await _webGameMessageRepository.CreateMany(endMessages);
    }
}
