
using chess.Application.Pagination;
using chess.Application.Repositories;
using chess.Application.Services;
using chess.Core.Enums;
using chess.Shared.Exceptions;
using MediatR;
using Microsoft.IdentityModel.Tokens;

namespace chess.Application.Requests.GameRequests.GetFinishedGames;

public class GetFinishedGamesRequestHandler : IRequestHandler<GetFinishedGamesRequest, PagedResult<GetFinishedGamesDto>> {

    private readonly IUserContextService _userContextService;
    private readonly IPlayerRepository _playerRepository;

    public GetFinishedGamesRequestHandler(IUserContextService userContextService, IPlayerRepository playerRepository) {
        _userContextService = userContextService;
        _playerRepository = playerRepository;
    }


    public async Task<PagedResult<GetFinishedGamesDto>> Handle(GetFinishedGamesRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var players = await _playerRepository.GetAllForUser(userId) 
            ?? throw new NotFoundException("Players not found.");

        var finishedGames = new List<GetFinishedGamesDto>();

        if(request.TimingTypeFilters == null) { }

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


                bool? isWinner = player.WhiteGame.WinnerColor != null ? player.WhiteGame.WinnerColor == Colors.Black : null;

                if (request.ResultFilters is not null &&
                    !request.ResultFilters.IsNullOrEmpty() &&
                    !request.ResultFilters.Contains(isWinner))
                    continue;

                var gameDto = new GetFinishedGamesDto()
                {
                    Position = player.WhiteGame.Position,
                    Turn = player.WhiteGame.Turn,
                    Moves = player.WhiteGame.Round,
                    IsWinner = isWinner,
                    EloGained = player.WhiteGame.EloGain,
                    CreatedAt = player.WhiteGame.CreatedAt,

                    TimingType = player.WhiteGame.TimingType,
                    EndGameType = player.WhiteGame.EndGameType,


                    WhitePlayer = new GetFinishedGamesPlayerDto()
                    { 
                        Name = player.WhiteGame.WhitePlayer.Name,
                        ImageUrl = player.WhiteGame.WhitePlayer.ImageUrl,
                        Elo = player.WhiteGame.WhitePlayer.Elo,

                    },

                    BlackPlayer = new GetFinishedGamesPlayerDto()
                    {
                        Name = player.WhiteGame.BlackPlayer.Name,
                        ImageUrl = player.WhiteGame.BlackPlayer.ImageUrl,
                        Elo = player.WhiteGame.BlackPlayer.Elo,
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

                bool? isWinner = player.BlackGame.WinnerColor != null ? player.BlackGame.WinnerColor == Colors.Black : null;

                if (request.ResultFilters is not null &&
                    !request.ResultFilters.IsNullOrEmpty() &&
                    !request.ResultFilters.Contains(isWinner))
                    continue;

                var gameDto = new GetFinishedGamesDto()
                {
                    Position = player.BlackGame.Position,
                    Turn = player.BlackGame.Turn,
                    Moves = player.BlackGame.Round,
                    IsWinner = isWinner,
                    EloGained = player.BlackGame.EloGain,
                    CreatedAt = player.BlackGame.CreatedAt,

                    TimingType = player.BlackGame.TimingType,
                    EndGameType = player.BlackGame.EndGameType,


                    WhitePlayer = new GetFinishedGamesPlayerDto()
                    {
                        Name = player.BlackGame.WhitePlayer.Name,
                        ImageUrl = player.BlackGame.WhitePlayer.ImageUrl,
                        Elo = player.BlackGame.WhitePlayer.Elo,
                    },

                    BlackPlayer = new GetFinishedGamesPlayerDto()
                    {
                        Name = player.BlackGame.BlackPlayer.Name,
                        ImageUrl = player.BlackGame.BlackPlayer.ImageUrl,
                        Elo = player.BlackGame.BlackPlayer.Elo,
                    }
                };

                finishedGames.Add(gameDto);
            }
        }

        var pagedResult = new PagedResult<GetFinishedGamesDto>(finishedGames, finishedGames.Count, request.PageSize, request.PageNumber);

        return pagedResult;

    }
}
