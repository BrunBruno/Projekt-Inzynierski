
using chess.Application.Pagination;
using chess.Application.Repositories.FriendshipRepositories;
using chess.Application.Repositories.UserRepositories;
using chess.Application.Services;
using chess.Core.Dtos;
using chess.Core.Enums;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.FriendshipRequests.GetFriendshipRanking;

/// <summary>
/// Check if current user exists
/// Gets all friends
/// Orders user by selected timing
/// Returns paged result of user ranking
/// </summary>
public class GetFriendshipRankingRequestHandler : IRequestHandler<GetFriendshipRankingRequest, PagedResult<GetFriendshipRankingDto>> {

    private readonly IUserContextService _userContextService;
    private readonly IUserRepository _userRepository;
    private readonly IFriendshipRepository _friendshipRepository;

    public GetFriendshipRankingRequestHandler(
        IUserContextService userContextService,
        IUserRepository userRepository,
        IFriendshipRepository friendshipRepository
    ) {
        _userContextService = userContextService;
        _userRepository = userRepository;
        _friendshipRepository = friendshipRepository;
    }

    public async Task<PagedResult<GetFriendshipRankingDto>> Handle(GetFriendshipRankingRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var currentUser = await _userRepository.GetById(userId)
            ?? throw new NotFoundException("User not found.");

        var friendsIds = await _friendshipRepository.GetAllFriendIds(userId, FriendshipStatus.Accepted);

        var friends = await _userRepository.GetAllFriends(friendsIds, userId);
        friends.Add(currentUser);

        var friendsOrdered = friends.OrderBy(f =>
            request.Type == TimingTypes.Bullet ? f.Elo.Bullet :
            request.Type == TimingTypes.Blitz ? f.Elo.Blitz :
            request.Type == TimingTypes.Rapid ? f.Elo.Rapid :
            request.Type == TimingTypes.Classic ? f.Elo.Classic :
            request.Type == TimingTypes.Daily ? f.Elo.Daily : 0
        ).ThenByDescending(f => f.Stats.Wins);


        var result = friendsOrdered.Select((user, index) => new GetFriendshipRankingDto()
        {
            Position = index + 1,
            Username = user.Username,
            Elo = request.Type == TimingTypes.Bullet ? user.Elo.Bullet :
                  request.Type == TimingTypes.Blitz ? user.Elo.Blitz :
                  request.Type == TimingTypes.Rapid ? user.Elo.Rapid :
                  request.Type == TimingTypes.Classic ? user.Elo.Classic :
                  request.Type == TimingTypes.Daily ? user.Elo.Daily : 0,
            GamesPlayed = user.Stats.GamesPlayed,
            Ratio = user.Stats.GamesPlayed > 0 ?
                $"{100 * user.Stats.Wins / user.Stats.GamesPlayed}%:" +
                $"{100 * user.Stats.Draws / user.Stats.GamesPlayed}%:" +
                $"{100 * user.Stats.Loses / user.Stats.GamesPlayed}%" : "-",
            IsUser = userId == user.Id,

            Profile = user.Image != null ? new ImageDto() {
                ContentType = user.Image.ContentType,
                Data = user.Image.Data
            } : null,
        }).ToList();


        var pagedResult = new PagedResult<GetFriendshipRankingDto>(result, result.Count, request.PageSize, request.PageNumber);

        return pagedResult;
    }
}
