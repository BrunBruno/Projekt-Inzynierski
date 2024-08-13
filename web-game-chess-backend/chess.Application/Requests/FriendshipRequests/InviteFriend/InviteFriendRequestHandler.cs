
using chess.Application.Repositories;
using chess.Application.Services;
using chess.Core.Entities;
using chess.Core.Enums;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.FriendshipRequests.InviteFriend;

/// <summary>
/// Check if provided id is correct
/// Check if user is not already accepted
/// Check if friendship is already pending
/// Check if counterparty has not block current user
/// Creates new friendship
/// </summary>
public class InviteFriendRequestHandler : IRequestHandler<InviteFriendRequest> {

    private readonly IFriendshipRepository _friendshipRepository;
    private readonly IUserContextService _userContextService;
    private readonly IUserRepository _userRepository;

    public InviteFriendRequestHandler(
        IFriendshipRepository friendshipRepository,
        IUserContextService userContextService,
        IUserRepository userRepository
    ) {
        _friendshipRepository = friendshipRepository;
        _userContextService = userContextService;
        _userRepository = userRepository;
    }

    public async Task Handle(InviteFriendRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        if (userId == request.ReceiverId)
            throw new BadRequestException("Can not invite yourself.");


        var userToBeFriend = await _userRepository.GetById(request.ReceiverId)
            ?? throw new NotFoundException("User not found.");


        var usersAcceptedFriends = await _friendshipRepository.GetAllForUserByStatus(userId, FriendshipStatus.Accepted);
        var acceptedFriendIds = usersAcceptedFriends
            .Select(f => f.RequestorId == userId ? f.ReceiverId : f.RequestorId)
            .ToList();

        if (acceptedFriendIds.Contains(request.ReceiverId))
            throw new BadRequestException("User is already a friend.");


        var usersPendingFriends = await _friendshipRepository.GetAllForUserByStatus(userId, FriendshipStatus.Pending);
        var pendingFriendIds = usersPendingFriends
            .Select(f => f.RequestorId == userId ? f.ReceiverId : f.RequestorId)
            .ToList();

        if (pendingFriendIds.Contains(request.ReceiverId))
            throw new BadRequestException("Friend request is still pending.");


        var usersBloeckedFriends = await _friendshipRepository.GetAllForUserByStatus(userId, FriendshipStatus.Rejected);
        var blockedFriendIds = usersBloeckedFriends
            .Select(f => f.RequestorId == userId ? f.ReceiverId : f.RequestorId)
            .ToList();

        if (blockedFriendIds.Contains(request.ReceiverId))
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
