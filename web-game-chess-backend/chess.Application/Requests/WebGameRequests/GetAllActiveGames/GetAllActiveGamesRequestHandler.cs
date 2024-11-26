
using chess.Application.Pagination;
using chess.Application.Repositories.WebGameRepositories;
using chess.Application.Services;
using chess.Core.Dtos;
using chess.Core.Entities;
using MediatR;
using Microsoft.IdentityModel.Tokens;

namespace chess.Application.Requests.WebGameRequests.GetAllActiveGames;

/// <summary>
/// Gets all player that has not finished game yet
/// Go throw all players games
/// Checks if game should be ended
/// Apply filters
/// Creates and returns paged result of game dtos
/// </summary>
public class GetAllActiveGamesRequestHandler : IRequestHandler<GetAllActiveGamesRequest, PagedResult<GetAllActiveGamesDto>> {

    private readonly IUserContextService _userContextService;
    private readonly IWebGamePlayerRepository _webGamePlayerRepository;

    public GetAllActiveGamesRequestHandler(
        IUserContextService userContextService,
        IWebGamePlayerRepository playerRepository
    ) {
        _userContextService = userContextService;
        _webGamePlayerRepository = playerRepository;
    }

    public async Task<PagedResult<GetAllActiveGamesDto>> Handle(GetAllActiveGamesRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var players = await _webGamePlayerRepository.GetAllActiveForUser(userId);

        var finishedGames = new List<GetAllActiveGamesDto>();

        foreach (var player in players) {

            // player is white
            if (player.WhiteGame is not null &&
                player.WhiteGame.WhitePlayer is not null &&
                player.WhiteGame.BlackPlayer is not null &&
                !player.WhiteGame.HasEnded
            ) {
                var game = player.WhiteGame;

                // check if game should ended
                if (GameShouldNotBeDisplayed(game))
                    continue;

                // filter by timing type
                if (request.TimingTypeFilters is not null &&
                    !request.TimingTypeFilters.IsNullOrEmpty() &&
                    !request.TimingTypeFilters.Contains(player.WhiteGame.TimingType))
                    continue;

                double timeDifference = 0;
                var lastTimeRecorded = (game.Moves == null || game.Moves.Count == 0) ? game.StartedAt : game.Moves[^1].DoneAt;
                if(lastTimeRecorded != null) {
                    timeDifference = (DateTime.UtcNow - lastTimeRecorded.Value).TotalSeconds;
                }

                var gameDto = new GetAllActiveGamesDto()
                {
                    GameId = game.Id,
                    Position = game.Position,
                    Turn = game.Turn,
                    Moves = game.Round,
                    CreatedAt = game.CreatedAt,
                    TimingType = game.TimingType,
                    TimeLeft = game.Turn % 2 == 0 ? player.TimeLeft - timeDifference : player.TimeLeft,

                    // current user player
                    WhitePlayer = new PlayerDto()
                    {
                        Name = player.Name,
                        Elo = player.Elo,

                        ProfilePicture = player.User.Image != null ? new ImageDto()
                        {
                            Data = player.User.Image.Data,
                            ContentType = player.User.Image.ContentType,
                        } : null,
                    },
                    // opponents player
                    BlackPlayer = new PlayerDto()
                    {
                        Name = game.BlackPlayer.Name,
                        Elo = game.BlackPlayer.Elo,

                        ProfilePicture = game.BlackPlayer.User.Image != null ? new ImageDto()
                        {
                            Data = game.BlackPlayer.User.Image.Data,
                            ContentType = game.BlackPlayer.User.Image.ContentType,
                        } : null,
                    }

                };

                finishedGames.Add(gameDto);
            }

            // player is black
            if (player.BlackGame is not null &&
                player.BlackGame.WhitePlayer is not null &&
                player.BlackGame.BlackPlayer is not null &&
                !player.BlackGame.HasEnded
            ) {
                var game = player.BlackGame;

                // check if game should ended
                if (GameShouldNotBeDisplayed(game))
                    continue;

                // filter by timing type
                if (request.TimingTypeFilters is not null &&
                    !request.TimingTypeFilters.IsNullOrEmpty() &&
                    !request.TimingTypeFilters.Contains(game.TimingType))
                    continue;

                double timeDifference = 0;
                var lastTimeRecorded = (game.Moves == null || game.Moves.Count == 0) ? game.StartedAt : game.Moves[^1].DoneAt;
                if(lastTimeRecorded != null) {
                    timeDifference = (DateTime.UtcNow - lastTimeRecorded.Value).TotalSeconds;
                }


                var gameDto = new GetAllActiveGamesDto()
                {
                    GameId = game.Id,
                    Position = game.Position,
                    Turn = game.Turn,
                    Moves = game.Round,
                    CreatedAt = game.CreatedAt,
                    TimingType = game.TimingType,
                    TimeLeft = game.Turn % 2 == 1 ? player.TimeLeft - timeDifference : player.TimeLeft, 

                    // opponents players
                    WhitePlayer = new PlayerDto()
                    {
                        Name = game.WhitePlayer.Name,
                        Elo = game.WhitePlayer.Elo,

                        ProfilePicture = game.WhitePlayer.User.Image != null ? new ImageDto()
                        {
                            Data = game.WhitePlayer.User.Image.Data,
                            ContentType = game.WhitePlayer.User.Image.ContentType,
                        } : null,
                    },
                    // current user player
                    BlackPlayer = new PlayerDto()
                    {
                        Name = player.Name,
                        Elo = player.Elo,

                        ProfilePicture = player.User.Image != null ? new ImageDto()
                        {
                            Data = player.User.Image.Data,
                            ContentType = player.User.Image.ContentType,
                        } : null,
                    }
                };

                finishedGames.Add(gameDto);
            }
        }

        var pagedResult = new PagedResult<GetAllActiveGamesDto>(finishedGames, finishedGames.Count, request.PageSize, request.PageNumber);
        return pagedResult;
    }

    /// <summary>
    /// To check if game should be ended
    /// </summary>
    /// <param name="game"></param>
    /// <returns></returns>
    private static bool GameShouldNotBeDisplayed(WebGame game) {

        var lastTimeRecorded = (game.Moves == null || game.Moves.Count == 0) ? game.StartedAt : game.Moves[^1].DoneAt;

        if (lastTimeRecorded is null)
            return true;


        var currentTime =  DateTime.UtcNow;

        if (currentTime < lastTimeRecorded)
            return true;


        var timeDifference =  (currentTime - lastTimeRecorded.Value).TotalSeconds;


        double whiteTimeLeft;
        double blackTimeLeft;

        if (game.Turn % 2 == 0) {

            whiteTimeLeft = game.WhitePlayer.TimeLeft - timeDifference;
            blackTimeLeft = game.BlackPlayer.TimeLeft;

        } else {

            whiteTimeLeft = game.WhitePlayer.TimeLeft;
            blackTimeLeft = game.BlackPlayer.TimeLeft - timeDifference;

        }

        if (whiteTimeLeft <= 0 || blackTimeLeft <= 0)
            return true;

        return false;
    }
}
