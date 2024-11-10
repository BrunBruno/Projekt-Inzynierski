
using chess.Application.Pagination;
using chess.Application.Repositories.FriendshipRepositories;
using chess.Application.Repositories.UserRepositories;
using chess.Core.Enums;
using MediatR;

namespace chess.Application.Requests.UserRequests.GetUsersRanking;

public class GetUsersRankingRequestHandler : IRequestHandler<GetUsersRankingRequest, PagedResult<GetUsersRankingDto>> {

    private readonly IUserRepository _userRepository;
    private readonly IFriendshipRepository _friendshipRepository;

    public GetUsersRankingRequestHandler(
        IUserRepository userRepository,
        IFriendshipRepository friendshipRepository
    ) {
        _userRepository = userRepository;
        _friendshipRepository = friendshipRepository;
    }

    public async Task<PagedResult<GetUsersRankingDto>> Handle(GetUsersRankingRequest request, CancellationToken cancellationToken) {

        var users = await _userRepository.GetAllOrderByRating(request.Type);


        var result = users.Select((user, index) => new GetUsersRankingDto() { 
            Position = index + 1,
            Username = user.Username,
            Elo = request.Type == TimingTypes.Bullet ? user.Elo.Bullet : 
                  request.Type == TimingTypes.Blitz ? user.Elo.Blitz :
                  request.Type == TimingTypes.Rapid ? user.Elo.Rapid :
                  request.Type == TimingTypes.Classic ? user.Elo.Classic :
                  request.Type == TimingTypes.Daily ? user.Elo.Daily : 0,
            GamesPlayed = user.Stats.GamesPlayed,
            Ratio = user.Stats.GamesPlayed > 0 ?
                $"W{100 * user.Stats.Wins / user.Stats.GamesPlayed}%:" +
                $"D{100 * user.Stats.Draws / user.Stats.GamesPlayed}%:" +
                $"L{100 * user.Stats.Loses / user.Stats.GamesPlayed}%" : "-",
        }).ToList();


        var pagedResult = new PagedResult<GetUsersRankingDto>(result, result.Count, request.PageSize, request.PageNumber);

        return pagedResult;

    }
}
