﻿
using chess.Application.Pagination;
using chess.Application.Repositories.WebGameRepositories;
using chess.Application.Services;
using chess.Core.Enums;
using MediatR;

namespace chess.Application.Requests.WebGameRequests.GetTypeHistory;

/// <summary>
/// Checks if user exists
/// Checks if players for user exists
/// Creates history of games for selected and provided game timing type
/// Returns type history
/// </summary>
public class GetTypeHistoryRequestHandler : IRequestHandler<GetTypeHistoryRequest, PagedResult<GetTypeHistoryDto>> {

    private readonly IUserContextService _userContextService;
    private readonly IWebGamePlayerRepository _webGamePlayerRepository;

    public GetTypeHistoryRequestHandler(
        IUserContextService userContextService,
        IWebGamePlayerRepository playerRepository
    ) {
        _userContextService = userContextService;
        _webGamePlayerRepository = playerRepository;
    }

    public async Task<PagedResult<GetTypeHistoryDto>> Handle(GetTypeHistoryRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var players = await _webGamePlayerRepository.GetAllFinishedForUser(userId);

        var typeHistory = new List<GetTypeHistoryDto>();

        foreach (var player in players) {

            if (player.WhiteGame != null && player.WhiteGame.TimingType == request.Type) {

                bool? isWinner = player.WhiteGame.WinnerColor != null ? player.WhiteGame.WinnerColor == PieceColor.White : null;

                var typeHistoryDto = new GetTypeHistoryDto()
                {
                    WhitePlayer =  player.WhiteGame.WhitePlayer.Name,
                    BlackPlayer = player.WhiteGame.BlackPlayer.Name,
                    Moves = player.WhiteGame.Round,
                    IsWinner = isWinner,
                    PrevElo = player.WhiteGame.WhitePlayer.Elo,
                    CreatedAt = player.WhiteGame.CreatedAt,
                };

                typeHistory.Add(typeHistoryDto);
            }

            if (player.BlackGame != null && player.BlackGame.TimingType == request.Type) {

                bool? isWinner = player.BlackGame.WinnerColor != null ? player.BlackGame.WinnerColor == PieceColor.Black : null;

                var typeHistoryDto = new GetTypeHistoryDto()
                {
                    WhitePlayer = player.BlackGame.WhitePlayer.Name,
                    BlackPlayer = player.BlackGame.BlackPlayer.Name,
                    Moves = player.BlackGame.Round,
                    IsWinner = isWinner,
                    PrevElo = player.BlackGame.BlackPlayer.Elo,
                    CreatedAt = player.BlackGame.CreatedAt,
                };

                typeHistory.Add(typeHistoryDto);
            }

        }

        var sortedHistory = typeHistory.OrderBy(h => h.CreatedAt).ToList();

        var pagedResult = new PagedResult<GetTypeHistoryDto>(sortedHistory, typeHistory.Count, request.PageSize, request.PageNumber);

        return pagedResult;
    }
}
