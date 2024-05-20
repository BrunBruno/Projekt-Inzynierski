﻿
using chess.Application.Pagination;
using chess.Application.Repositories;
using chess.Application.Services;
using chess.Core.Enums;
using chess.Shared.Exceptions;
using MediatR;

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

        var x = players;

        var finishedGames = new List<GetFinishedGamesDto>();

        foreach(var player in players) { 
            if(player.WhiteGame != null &&
                player.WhiteGame.WhitePlayer != null &&
                player.WhiteGame.BlackPlayer != null &&
                player.WhiteGame.HasEnded
            ){
                finishedGames.Add(new GetFinishedGamesDto()
                {
                    Position = player.WhiteGame.Position,
                    Turn = player.WhiteGame.Turn,
                    Moves = player.WhiteGame.Round,
                    IsWinner = player.WhiteGame.WinnerColor != null ? player.WhiteGame.WinnerColor == Colors.White : null,
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
                    
                });
            }
            if (player.BlackGame != null &&
                player.BlackGame.WhitePlayer != null &&
                player.BlackGame.BlackPlayer != null &&
                player.BlackGame.HasEnded
            ) {
                finishedGames.Add(new GetFinishedGamesDto()
                {
                    Position = player.BlackGame.Position,
                    Turn = player.BlackGame.Turn,
                    Moves = player.BlackGame.Round,
                    IsWinner = player.BlackGame.WinnerColor != null ? player.BlackGame.WinnerColor == Colors.Black : null,
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
                });
            }
        }

        var pagedResult = new PagedResult<GetFinishedGamesDto>(finishedGames, finishedGames.Count, request.PageSize, request.PageNumber);

        return pagedResult;

    }
}