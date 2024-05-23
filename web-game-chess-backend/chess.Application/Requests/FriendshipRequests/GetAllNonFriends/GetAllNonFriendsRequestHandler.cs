
using chess.Application.Pagination;
using chess.Application.Repositories;
using chess.Application.Services;
using MediatR;

namespace chess.Application.Requests.FriendshipRequests.GetAllNonFriends;

public class GetAllNonFriendsRequestHandler : IRequestHandler<GetAllNonFriendsRequest, PagedResult<GetAllNonFriendsDto>> {

    private readonly IFriendshipRepository _friendshipRepository;
    private readonly IUserContextService _userContextService;
    private readonly IUserRepository _userRepository;

    public GetAllNonFriendsRequestHandler(
        IFriendshipRepository friendshipRepository,
        IUserContextService userContextService,
        IUserRepository userRepository
    ) {
        _friendshipRepository = friendshipRepository;
        _userContextService = userContextService;
        _userRepository = userRepository;
    }

    public async Task<PagedResult<GetAllNonFriendsDto>> Handle(GetAllNonFriendsRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var friendsIds = await _friendshipRepository.GetAllFriendIds(userId);

        var nonFriends = await _userRepository.GetAllNonFriends(friendsIds, userId);

        if(request.Username is not null) {
            nonFriends = nonFriends.Where(nf => 
                nf.Username.ToLower().Contains(request.Username) ||
                nf.Email.ToLower().Contains(request.Username) ||
                (nf.Name != null && nf.Name.ToLower().Contains(request.Username))
            ).ToList();
        }

        var nonFriendsDtos = nonFriends.Select(nf => new GetAllNonFriendsDto()
        {
            UserId = nf.Id,
            Username = nf.Username,
            Name = nf.Name,
            ImageUrl = nf.ImageUrl,
            Elo = nf.Elo,
        }).ToList();

        var pagedResult = new PagedResult<GetAllNonFriendsDto>(nonFriendsDtos, nonFriendsDtos.Count, request.PageSize, request.PageNumber);

        return pagedResult;
    }
}