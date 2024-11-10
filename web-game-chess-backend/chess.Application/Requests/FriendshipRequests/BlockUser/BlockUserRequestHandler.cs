
using chess.Application.Repositories.FriendshipRepositories;
using chess.Application.Repositories.UserRepositories;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Core.Enums;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.FriendshipRequests.BlockUser;

public class BlockUserRequestHandler : IRequestHandler<BlockUserRequest> {

    private readonly IUserContextService _userContextService;
    private readonly IUserRepository _userRepository;
    private readonly IFriendshipRepository _friendshipRepository;

    public BlockUserRequestHandler(
        IUserContextService userContextService,
        IUserRepository userRepository,
        IFriendshipRepository friendshipRepository
    ) {
        _userContextService = userContextService;
        _userRepository = userRepository;
        _friendshipRepository = friendshipRepository;
    }

    public async Task Handle(BlockUserRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();


        if (userId == request.UserId)
            throw new BadRequestException("Can not block yourself.");


        var userToBlock = await _userRepository.GetById(request.UserId)
            ?? throw new NotFoundException("User not found.");



        var usersBlockedFriends = await _friendshipRepository.GetAllForUserByStatus(userId, FriendshipStatus.Rejected);
        var blockedFriendIds = usersBlockedFriends
            .Select(f => f.RequestorId == userId ? f.ReceiverId : f.RequestorId)
            .ToList();

        if (blockedFriendIds.Contains(request.UserId))
            throw new BadRequestException("User is blocked or has blocked you.");



        var friendship = new Friendship()
        {
            Id = Guid.NewGuid(),
            Status = FriendshipStatus.Rejected,
            RequestCreatedAt = DateTime.UtcNow,
            RequestorId = userId,
            ReceiverId = request.UserId,
        };


        await _friendshipRepository.Create(friendship);
    }
}
