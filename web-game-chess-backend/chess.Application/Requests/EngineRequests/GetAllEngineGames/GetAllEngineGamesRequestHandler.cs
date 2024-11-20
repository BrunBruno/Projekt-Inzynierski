
using chess.Application.Pagination;
using chess.Application.Repositories.EngineGameRepositories;
using chess.Application.Services;
using chess.Core.Dtos;
using chess.Core.Enums;
using MediatR;
using Microsoft.IdentityModel.Tokens;

namespace chess.Application.Requests.EngineRequests.GetAllEngineGames;

public class GetAllEngineGamesRequestHandler : IRequestHandler<GetAllEngineGamesRequest, PagedResult<GetAllEngineGamesDto>> {

    private readonly IUserContextService _userContextService;
    private readonly IEngineGamePlayerRepository _engineGamePlayerRepository;

    public GetAllEngineGamesRequestHandler(
        IUserContextService userContextService,
        IEngineGamePlayerRepository engineGamePlayerRepository
    ) {
        _userContextService = userContextService;
        _engineGamePlayerRepository = engineGamePlayerRepository;
    }

    public async Task<PagedResult<GetAllEngineGamesDto>> Handle(GetAllEngineGamesRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var players = await _engineGamePlayerRepository.GetAllForUser(userId);

        var engineGames = new List<GetAllEngineGamesDto>();

        foreach (var player in players) {
    
            var game = player.Game;

            bool isPlayerWhite = player.Color == PieceColor.White;
            bool? isWinner = game.WinnerColor != null ? player.Color == game.WinnerColor : null;


            // filter by game result
            if (request.ResultFilters is not null &&
                !request.ResultFilters.IsNullOrEmpty() &&
                !request.ResultFilters.Contains(isWinner))
                continue;

            var gameDto = new GetAllEngineGamesDto()
            {
                GameId = game.Id,
                Position = game.Position,
                Turn = game.Turn,
                Moves = game.Round,
                IsWinner = isWinner,
                EloGained = 0, //tododo
                CreatedAt = game.CreatedAt,

                // current user player
                WhitePlayer = isPlayerWhite ? new PlayerDto()
                {
                    Name = player.Name,
                    //Elo = player.Elo, tododo

                    ProfilePicture = player.User.Image != null ? new ImageDto()
                    {
                        Data = player.User.Image.Data,
                        ContentType = player.User.Image.ContentType,
                    } : null,
                } : new PlayerDto() { Name = "BOT" },

                // opponents player
                BlackPlayer = !isPlayerWhite ? new PlayerDto()
                {
                    Name = player.Name,
                    //Elo = player.Elo, tododo

                    ProfilePicture = player.User.Image != null ? new ImageDto()
                    {
                        Data = player.User.Image.Data,
                        ContentType = player.User.Image.ContentType,
                    } : null,
                } : new PlayerDto() { Name = "BOT" },

            };

            engineGames.Add(gameDto);
        }

        var pagedResult = new PagedResult<GetAllEngineGamesDto>(engineGames, engineGames.Count, request.PageSize, request.PageNumber);

        return pagedResult;
    }
}
