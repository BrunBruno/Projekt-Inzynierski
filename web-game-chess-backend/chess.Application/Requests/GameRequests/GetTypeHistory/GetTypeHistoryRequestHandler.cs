
using chess.Application.Pagination;
using chess.Application.Repositories;
using chess.Application.Requests.GameRequests.GetFinishedGames;
using chess.Application.Services;
using chess.Core.Enums;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.GameRequests.GetTypeHistory;

public class GetTypeHistoryRequestHandler : IRequestHandler<GetTypeHistoryRequest, PagedResult<GetTypeHistoryDto>> {

    private readonly IUserContextService _userContextService;
    private readonly IPlayerRepository _playerRepository;

    public GetTypeHistoryRequestHandler(IUserContextService userContextService, IPlayerRepository playerRepository) {
        _userContextService = userContextService;
        _playerRepository = playerRepository;
    }

    public async Task<PagedResult<GetTypeHistoryDto>> Handle(GetTypeHistoryRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var players = await _playerRepository.GetAllForUser(userId)
            ?? throw new NotFoundException("Players not found.");

        var typeHistory = new List<GetTypeHistoryDto>();

        foreach (var player in players) {

            if (player.WhiteGame != null && player.WhiteGame.TimingType == request.Type) {

                bool? isWinner = player.WhiteGame.WinnerColor != null ? player.WhiteGame.WinnerColor == Colors.Black : null;

                var typeHistoryDto = new GetTypeHistoryDto()
                {
                    Moves = player.WhiteGame.Round,
                    IsWinner = isWinner,
                    EloGained = player.WhiteGame.EloGain,
                    CreatedAt = player.WhiteGame.CreatedAt,

                };

                typeHistory.Add(typeHistoryDto);
            }

            if (player.BlackGame != null && player.BlackGame.TimingType == request.Type) {

                bool? isWinner = player.BlackGame.WinnerColor != null ? player.BlackGame.WinnerColor == Colors.Black : null;

                var typeHistoryDto = new GetTypeHistoryDto()
                {
                    Moves = player.BlackGame.Round,
                    IsWinner = isWinner,
                    EloGained = player.BlackGame.EloGain,
                    CreatedAt = player.BlackGame.CreatedAt,

                };

                typeHistory.Add(typeHistoryDto);
            }

        }

        var pagedResult = new PagedResult<GetTypeHistoryDto>(typeHistory, typeHistory.Count, request.PageSize, request.PageNumber);

        return pagedResult;
    }
}
