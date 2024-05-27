
using chess.Application.Repositories;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Core.Enums;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.FriendshipRequests.InviteFriend;

public class InviteFriendRequestHandler : IRequestHandler<InviteFriendRequest> {

    private readonly IFriendshipRepository _friendshipRepository;
    private readonly IUserContextService _userContextService;

    public InviteFriendRequestHandler(IFriendshipRepository friendshipRepository, IUserContextService userContextService) {
        _friendshipRepository = friendshipRepository;
        _userContextService = userContextService;
    }

    public async Task Handle(InviteFriendRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        if (userId == request.ReceiverId)
            throw new BadRequestException("Can not invite yourself.");

        var usersAcceptedFriends = await _friendshipRepository.GetAllForUserByStatus(userId, FriendshipStatus.Accepted);

        var acceptedFriendIds = usersAcceptedFriends
            .Select(f => f.RequestorId == userId ? f.ReceiverId : f.RequestorId)
            .ToList();

        bool isAccepted = acceptedFriendIds.Contains(request.ReceiverId);

        if (isAccepted)
            throw new BadRequestException("User is already a friend.");


        var usersPendingFriends = await _friendshipRepository.GetAllForUserByStatus(userId, FriendshipStatus.Pending);

        var pendingFriendIds = usersPendingFriends
            .Select(f => f.RequestorId == userId ? f.ReceiverId : f.RequestorId)
            .ToList();

        bool isPending = pendingFriendIds.Contains(request.ReceiverId);


        if (isPending)
            throw new BadRequestException("Friend request is still pending.");


        var usersBloeckedFriends = await _friendshipRepository.GetAllForUserByStatus(userId, FriendshipStatus.Rejected);

        var blockedFriendIds = usersBloeckedFriends
            .Select(f => f.RequestorId == userId ? f.ReceiverId : f.RequestorId)
            .ToList();

        bool isBlocked = blockedFriendIds.Contains(request.ReceiverId);

        if (isBlocked)
            throw new BadRequestException("User is blocked or has blocked you.");



        var friendship = new Friendship()
        {
            Id = Guid.NewGuid(),
            Status = FriendshipStatus.Pending,
            RequestCreatedAt = DateTime.UtcNow,
            RequestorId = userId,
            ReceiverId = request.ReceiverId,
        };

        await _friendshipRepository.Create(friendship);
    }
}
