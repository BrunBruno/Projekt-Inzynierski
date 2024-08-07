﻿
using chess.Application.Pagination;
using chess.Application.Repositories;
using chess.Application.Services;
using chess.Core.Enums;
using chess.Shared.Exceptions;
using MediatR;
using chess.Core.Extensions;

namespace chess.Application.Requests.GameRequests.GetTypeHistory;

public class GetTypeHistoryRequestHandler : IRequestHandler<GetTypeHistoryRequest, PagedResult<GetTypeHistoryDto>> {

    private readonly IUserContextService _userContextService;
    private readonly IPlayerRepository _playerRepository;
    private readonly IUserRepository _userRepository;

    public GetTypeHistoryRequestHandler(
        IUserContextService userContextService,
        IPlayerRepository playerRepository,
        IUserRepository userRepository
    ) {
        _userContextService = userContextService;
        _playerRepository = playerRepository;
        _userRepository = userRepository;
    }

    public async Task<PagedResult<GetTypeHistoryDto>> Handle(GetTypeHistoryRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var user = await _userRepository.GetById(userId)
            ?? throw new NotFoundException("User not found.");

        var players = await _playerRepository.GetAllForUser(userId)
            ?? throw new NotFoundException("Players not found.");

        var typeHistory = new List<GetTypeHistoryDto>();

        foreach (var player in players) {

            if (player.WhiteGame != null && player.WhiteGame.TimingType == request.Type) {

                bool? isWinner = player.WhiteGame.WinnerColor != null ? player.WhiteGame.WinnerColor == Colors.White : null;

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

                bool? isWinner = player.BlackGame.WinnerColor != null ? player.BlackGame.WinnerColor == Colors.Black : null;

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
