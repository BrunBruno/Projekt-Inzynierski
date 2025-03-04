﻿
using chess.Application.Repositories.FriendshipRepositories;
using chess.Application.Services;
using chess.Core.Enums;
using chess.Shared.Exceptions;
using MediatR;

namespace chess.Application.Requests.FriendshipRequests.RespondToFriendRequest;

/// <summary>
/// Checks if friendship exists
/// Checks if user is receiver
/// Checks if user owns friendship
/// Updates friendship status based on provided answer
/// </summary>
public class RespondToFriendRequestRequestHandler : IRequestHandler<RespondToFriendRequestRequest> {

    private readonly IFriendshipRepository _friendshipRepository;
    private readonly IUserContextService _userContextService;   

    public RespondToFriendRequestRequestHandler(
        IFriendshipRepository friendshipRepository,
        IUserContextService userContextService
    ) {
        _friendshipRepository = friendshipRepository;
        _userContextService = userContextService;
    }

    public async Task Handle(RespondToFriendRequestRequest request, CancellationToken cancellationToken) {

        var userId = _userContextService.GetUserId();

        var friendship = await _friendshipRepository.GetById(request.FriendshipId) 
            ?? throw new NotFoundException("Friend request not found");

        if (friendship.RequestorId == userId)
            throw new BadRequestException("This friend request was sent by you");

        if (friendship.ReceiverId != userId)
            throw new UnauthorizedException("This is not your friendship request");

        if (request.IsAccepted) {

            friendship.Status = FriendshipStatus.Accepted;

            await _friendshipRepository.Update(friendship);

        } else {

            await _friendshipRepository.Delete(friendship);

        }

    }
}
