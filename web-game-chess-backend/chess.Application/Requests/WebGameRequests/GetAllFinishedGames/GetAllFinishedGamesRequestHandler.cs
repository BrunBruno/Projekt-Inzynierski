
using chess.Application.Pagination;
using chess.Application.Repositories.WebGameRepositories;
using chess.Application.Services;
using chess.Core.Dtos;
using chess.Core.Enums;
using MediatR;
using Microsoft.IdentityModel.Tokens;

namespace chess.Application.Requests.WebGameRequests.GetAllFinishedGames;

/// <summary>
/// Gets all players for current user
/// Creates amd return paged result of all previous games, based on user players
/// </summary>
public class GetAllFinishedGamesRequestHandler : IRequestHandler<GetAllFinishedGamesRequest, PagedResult<GetAllFinishedGamesDto>> {

    private readonly IUserContextService _userContextService;
    private readonly IWebGamePlayerRepository _playerRepository;

    public GetAllFinishedGamesRequestHandler(
        IUserContextService userContextService,
        IWebGamePlayerRepository playerRepository
    ) {
        _userContextService = userContextService;
        _playerRepository = playerRepository;
    }


    public async Task<PagedResult<GetAllFinishedGamesDto>> Handle(GetAllFinishedGamesRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var players = await _playerRepository.GetAllFinishedForUser(userId);

        var finishedGames = new List<GetAllFinishedGamesDto>();

        foreach(var player in players) {

            // player is white
            if(player.WhiteGame is not null &&
                player.WhiteGame.WhitePlayer is not null &&
                player.WhiteGame.BlackPlayer is not null &&
                player.WhiteGame.HasEnded 
            ){
                var game = player.WhiteGame;

                // filter bt timing type
                if (request.TimingTypeFilters is not null &&
                    !request.TimingTypeFilters.IsNullOrEmpty() &&
                    !request.TimingTypeFilters.Contains(game.TimingType))
                    continue;


                bool? isWinner = game.WinnerColor != null ? game.WinnerColor == PieceColor.White : null;

                // filter by game result
                if (request.ResultFilters is not null &&
                    !request.ResultFilters.IsNullOrEmpty() &&
                    !request.ResultFilters.Contains(isWinner))
                    continue;

                var gameDto = new GetAllFinishedGamesDto()
                {
                    GameId = game.Id,
                    Position = game.Position,
                    Turn = game.Turn,
                    Moves = game.Round,
                    IsWinner = isWinner,
                    EloGained = game.EloGain,
                    CreatedAt = game.CreatedAt,
                    TimingType = game.TimingType,
                    EndGameType = player.WhiteGame.EndGameType,

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
                player.BlackGame.HasEnded
            ) {
                var game = player.BlackGame;

                // filter by timing type
                if (request.TimingTypeFilters is not null &&
                    !request.TimingTypeFilters.IsNullOrEmpty() &&
                    !request.TimingTypeFilters.Contains(game.TimingType))
                    continue;

                bool? isWinner = game.WinnerColor != null ? game.WinnerColor == PieceColor.Black : null;

                // filter by game result
                if (request.ResultFilters is not null &&
                    !request.ResultFilters.IsNullOrEmpty() &&
                    !request.ResultFilters.Contains(isWinner))
                    continue;

                var gameDto = new GetAllFinishedGamesDto()
                {
                    GameId = game.Id,
                    Position = game.Position,
                    Turn = game.Turn,
                    Moves = game.Round,
                    IsWinner = isWinner,
                    EloGained = game.EloGain,
                    CreatedAt = game.CreatedAt,
                    TimingType = game.TimingType,
                    EndGameType = game.EndGameType,

                    // opponents player
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

        var pagedResult = new PagedResult<GetAllFinishedGamesDto>(finishedGames, finishedGames.Count, request.PageSize, request.PageNumber);

        return pagedResult;
    }
}
