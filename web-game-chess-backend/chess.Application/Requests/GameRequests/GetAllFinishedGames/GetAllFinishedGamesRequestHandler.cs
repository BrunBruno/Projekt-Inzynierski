
using chess.Application.Pagination;
using chess.Application.Repositories;
using chess.Application.Services;
using chess.Core.Dtos;
using chess.Core.Enums;
using MediatR;
using Microsoft.IdentityModel.Tokens;

namespace chess.Application.Requests.GameRequests.GetAllFinishedGames;

/// <summary>
/// Gets all players for current user
/// Creates amd return paged result of all previous games, based on user players
/// </summary>
public class GetAllFinishedGamesRequestHandler : IRequestHandler<GetAllFinishedGamesRequest, PagedResult<GetAllFinishedGamesDto>> {

    private readonly IUserContextService _userContextService;
    private readonly IPlayerRepository _playerRepository;

    public GetAllFinishedGamesRequestHandler(
        IUserContextService userContextService,
        IPlayerRepository playerRepository
    ) {
        _userContextService = userContextService;
        _playerRepository = playerRepository;
    }


    public async Task<PagedResult<GetAllFinishedGamesDto>> Handle(GetAllFinishedGamesRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var players = await _playerRepository.GetAllForUser(userId);

        var finishedGames = new List<GetAllFinishedGamesDto>();


        foreach(var player in players) {

            if(player.WhiteGame is not null &&
                player.WhiteGame.WhitePlayer is not null &&
                player.WhiteGame.BlackPlayer is not null &&
                player.WhiteGame.HasEnded 
            ){
                if (request.TimingTypeFilters is not null &&
                    !request.TimingTypeFilters.IsNullOrEmpty() &&
                    !request.TimingTypeFilters.Contains(player.WhiteGame.TimingType))
                    continue;


                bool? isWinner = player.WhiteGame.WinnerColor != null ? player.WhiteGame.WinnerColor == PieceColor.White : null;

                if (request.ResultFilters is not null &&
                    !request.ResultFilters.IsNullOrEmpty() &&
                    !request.ResultFilters.Contains(isWinner))
                    continue;

                var gameDto = new GetAllFinishedGamesDto()
                {
                    Position = player.WhiteGame.Position,
                    Turn = player.WhiteGame.Turn,
                    Moves = player.WhiteGame.Round,
                    IsWinner = isWinner,
                    EloGained = player.WhiteGame.EloGain,
                    CreatedAt = player.WhiteGame.CreatedAt,

                    TimingType = player.WhiteGame.TimingType,
                    EndGameType = player.WhiteGame.EndGameType,


                    WhitePlayer = new PlayerDto()
                    { 
                        Name = player.WhiteGame.WhitePlayer.Name,
                        Elo = player.WhiteGame.WhitePlayer.Elo,

                        ProfilePicture = player.WhiteGame.WhitePlayer.User.Image != null ? new ImageDto() 
                        {
                            Data = player.WhiteGame.WhitePlayer.User.Image.Data,
                            ContentType = player.WhiteGame.WhitePlayer.User.Image.ContentType,
                        } : null,
                    },

                    BlackPlayer = new PlayerDto()
                    {
                        Name = player.WhiteGame.BlackPlayer.Name,
                        Elo = player.WhiteGame.BlackPlayer.Elo,

                        ProfilePicture = player.WhiteGame.BlackPlayer.User.Image != null ? new ImageDto() 
                        {
                            Data = player.WhiteGame.BlackPlayer.User.Image.Data,
                            ContentType = player.WhiteGame.BlackPlayer.User.Image.ContentType,
                        } : null,
                    }
                    
                };

                finishedGames.Add(gameDto);
            }

            if (player.BlackGame is not null &&
                player.BlackGame.WhitePlayer is not null &&
                player.BlackGame.BlackPlayer is not null &&
                player.BlackGame.HasEnded
            ) {
                if (request.TimingTypeFilters is not null &&
                    !request.TimingTypeFilters.IsNullOrEmpty() &&
                    !request.TimingTypeFilters.Contains(player.BlackGame.TimingType))
                    continue;

                bool? isWinner = player.BlackGame.WinnerColor != null ? player.BlackGame.WinnerColor == PieceColor.Black : null;

                if (request.ResultFilters is not null &&
                    !request.ResultFilters.IsNullOrEmpty() &&
                    !request.ResultFilters.Contains(isWinner))
                    continue;

                var gameDto = new GetAllFinishedGamesDto()
                {
                    Position = player.BlackGame.Position,
                    Turn = player.BlackGame.Turn,
                    Moves = player.BlackGame.Round,
                    IsWinner = isWinner,
                    EloGained = player.BlackGame.EloGain,
                    CreatedAt = player.BlackGame.CreatedAt,

                    TimingType = player.BlackGame.TimingType,
                    EndGameType = player.BlackGame.EndGameType,


                    WhitePlayer = new PlayerDto()
                    {
                        Name = player.BlackGame.WhitePlayer.Name,
                        Elo = player.BlackGame.WhitePlayer.Elo,

                        ProfilePicture = player.BlackGame.WhitePlayer.User.Image != null ? new ImageDto() 
                        {
                            Data = player.BlackGame.WhitePlayer.User.Image.Data,
                            ContentType = player.BlackGame.WhitePlayer.User.Image.ContentType,
                        } : null,
                    },

                    BlackPlayer = new PlayerDto()
                    {
                        Name = player.BlackGame.BlackPlayer.Name,
                        Elo = player.BlackGame.BlackPlayer.Elo,

                        ProfilePicture = player.BlackGame.BlackPlayer.User.Image != null ? new ImageDto() 
                        {
                            Data = player.BlackGame.BlackPlayer.User.Image.Data,
                            ContentType = player.BlackGame.BlackPlayer.User.Image.ContentType,
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
