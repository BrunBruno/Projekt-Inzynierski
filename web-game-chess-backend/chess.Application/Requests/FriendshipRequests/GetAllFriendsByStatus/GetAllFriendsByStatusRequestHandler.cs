
using chess.Application.Pagination;
using chess.Application.Repositories;
using chess.Application.Services;
using MediatR;

namespace chess.Application.Requests.FriendshipRequests.GetAllFriendsByStatus;

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

        var friends = new List<GetAllFriendsByStatusDto>();

        foreach (var friendship in friendships) {

            var friendId = friendship.RequestorId == userId ? friendship.ReceiverId : friendship.RequestorId;

            var friend = await _userRepository.GetById(friendId);

            if (friend is not null) {

                var friendDto = new GetAllFriendsByStatusDto()
                {
                    Username = friend.Username,
                    Name = friend.Name,
                    ImageUrl = friend.ImageUrl,
                    Elo = friend.Elo,
                };

                friends.Add(friendDto);
            }
        }

        var pagedResult = new PagedResult<GetAllFriendsByStatusDto>(friends, friends.Count, request.PageSize, request.PageNumber);

        return pagedResult;
    }
}
