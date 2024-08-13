
using chess.Application.Pagination;
using chess.Application.Repositories;
using chess.Application.Services;
using chess.Core.Abstraction;
using chess.Core.Dtos;
using MediatR;

namespace chess.Application.Requests.FriendshipRequests.GetAllFriendsByStatus;

/// <summary>
/// Gets all friends based on provided freindship status
/// Filters users by provided username
/// Creates new user dto
/// Returns paged result of users
/// </summary>
public class GetAllFriendsByStatusRequestHandler : IRequestHandler<GetAllFriendsByStatusRequest, PagedResult<GetAllFriendsByStatusDto>> {

    private readonly IFriendshipRepository _friendshipRepository;
    private readonly IUserContextService _userContextService;
    private readonly IUserRepository _userRepository;

    public GetAllFriendsByStatusRequestHandler(
        IFriendshipRepository friendshipRepository,
        IUserContextService userContextService,
        IUserRepository userRepository
    ) {
        _friendshipRepository = friendshipRepository;
        _userContextService = userContextService;
        _userRepository = userRepository;
    }

    public async Task<PagedResult<GetAllFriendsByStatusDto>> Handle(GetAllFriendsByStatusRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var friendships = await _friendshipRepository.GetAllForUserByStatus(userId, request.Status);

        var friendsIds = await _friendshipRepository.GetAllFriendIds(userId, request.Status);

        var friends = await _userRepository.GetAllFriends(friendsIds, userId);


        if (request.Username is not null) {
            friends = friends.Where(nf =>
                nf.Username.ToLower().Contains(request.Username) ||
                nf.Email.ToLower().Contains(request.Username) ||
                (nf.Name != null && nf.Name.ToLower().Contains(request.Username))
            ).ToList();
        }


        var friendsDtos = new List<GetAllFriendsByStatusDto>();

        foreach (var friendship in friendships) {

            bool isRequestor = friendship.RequestorId == userId;
            var friendId = isRequestor ? friendship.ReceiverId : friendship.RequestorId;

            var friend = friends.Where(f => f.Id == friendId).FirstOrDefault();

            if (friend is not null) {
                friendsDtos.Add(new GetAllFriendsByStatusDto()
                {
                    FreindshpId = friendship.Id,
                    Username = friend.Username,
                    Name = friend.Name,
                    ImageUrl = friend.ImageUrl,
                    Country = friend.Country,
                    IsRequestor = isRequestor,

                    Elo = new EloDto()
                    {
                        Bullet = friend.Elo.Bullet,
                        Blitz = friend.Elo.Blitz,
                        Rapid = friend.Elo.Rapid,
                        Classic = friend.Elo.Classic,
                        Daily = friend.Elo.Daily,
                    },

                    WdlTotal = new WinDrawLose()
                    {
                        Total = friend.Stats.GamesPlayed,
                        Wins = friend.Stats.Wins,
                        Loses = friend.Stats.Loses,
                        Draws = friend.Stats.Draws,
                    },

                    WdlTogether = new WinDrawLose()
                    {
                        Total = friendship.GamesPlayed,
                        Wins = isRequestor ? friendship.RequestorWins : friendship.RequestorLoses,
                        Loses = isRequestor ? friendship.RequestorLoses : friendship.RequestorWins,
                        Draws = friendship.RequestorDraws,
                    },
                });
            }
        }

        var pagedResult = new PagedResult<GetAllFriendsByStatusDto>(friendsDtos, friendsDtos.Count, request.PageSize, request.PageNumber);

        return pagedResult;
    }
}
