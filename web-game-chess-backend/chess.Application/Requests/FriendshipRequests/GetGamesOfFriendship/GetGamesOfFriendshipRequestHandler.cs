
using chess.Application.Pagination;
using chess.Application.Repositories.FriendshipRepositories;
using chess.Application.Repositories.WebGameRepositories;
using chess.Core.Dtos;
using chess.Core.Enums;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.FriendshipRequests.GetGamesOfFriendship;

public class GetGamesOfFriendshipRequestHandler : IRequestHandler<GetGamesOfFriendshipRequest, PagedResult<GetGamesOfFriendshipDto>> {

    private readonly IFriendshipRepository _friendshipRepository;
    private readonly IWebGameRepository _webGameRepository;

    public GetGamesOfFriendshipRequestHandler(
        IFriendshipRepository friendshipRepository,
        IWebGameRepository webGameRepository
    ) {
        _friendshipRepository = friendshipRepository;
        _webGameRepository = webGameRepository;
    }

    public async Task<PagedResult<GetGamesOfFriendshipDto>> Handle(GetGamesOfFriendshipRequest request, CancellationToken cancellationToken) {

        var freindship = await _friendshipRepository.GetById(request.FriendshipId)
            ?? throw new NotFoundException("Friendship not found");

        var games = await _webGameRepository.GetAllForFriendship(freindship.RequestorId, freindship.ReceiverId);

        var friendshipGames = games.Select(game => new GetGamesOfFriendshipDto()
        {
            GameId = game.Id,
            Position = game.Position,
            Turn = game.Turn,
            Moves = game.Round,
            IsWinner = game.WinnerColor != null ? game.WinnerColor == PieceColor.White : null,
            EloGained = game.EloGain,
            CreatedAt = game.CreatedAt,
            TimingType = game.TimingType,
            EndGameType = game.EndGameType,

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
        }).ToList();

        var pagedResult = new PagedResult<GetGamesOfFriendshipDto>(friendshipGames, friendshipGames.Count, request.PageSize, request.PageNumber);

        return pagedResult;
    }
}
