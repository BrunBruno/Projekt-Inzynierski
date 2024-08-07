﻿
using chess.Application.Repositories;
using chess.Application.Services;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.FriendshipRequests.RemoveFriend;

/// <summary>
/// Checks if friendship exists
/// Checks if current users is one of friendship counterparty
/// Removes freindship
/// By removing freindship with status "rejected" it unblocks blocked freind
/// </summary>
public class RemoveFriendRequestHandler : IRequestHandler<RemoveFriendRequest> {

    private readonly IFriendshipRepository _friendshipRepository;
    private readonly IUserContextService _userContextService;

    public RemoveFriendRequestHandler(
        IFriendshipRepository friendshipRepository,
        IUserContextService userContextService
    ) {
        _friendshipRepository = friendshipRepository;
        _userContextService = userContextService;
    }

    public async Task Handle(RemoveFriendRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var friendshipToDelete = await _friendshipRepository.GetById(request.FriendshipId)
            ?? throw new NotFoundException("Friendship not found.");

        if (userId != friendshipToDelete.RequestorId && userId != friendshipToDelete.ReceiverId)
            throw new UnauthorizedException("Can not remove others friendship.");

        await _friendshipRepository.Delete(friendshipToDelete);
    }
}
