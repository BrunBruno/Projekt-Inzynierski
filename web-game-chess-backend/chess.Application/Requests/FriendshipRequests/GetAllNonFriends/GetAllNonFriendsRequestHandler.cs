﻿
using chess.Application.Pagination;
using chess.Application.Repositories;
using chess.Application.Services;
using chess.Core.Abstraction;
using chess.Core.Dtos;
using MediatR;

namespace chess.Application.Requests.FriendshipRequests.GetAllNonFriends;

/// <summary>
/// Collects all users that have not established relationship with current user
/// Filters users with provided username
/// Returns paged result of user dtos
/// </summary>
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

        // filter by username
        if(request.Username is not null) {
            nonFriends = nonFriends.Where(nf => 
                nf.Username.ToLower().Contains(request.Username) ||
                nf.Email.ToLower().Contains(request.Username) ||
                (nf.Name != null && nf.Name.ToLower().Contains(request.Username))
            ).ToList();
        }

        var nonFriendsDtos = nonFriends.Select(nonFriend => new GetAllNonFriendsDto()
        {
            UserId = nonFriend.Id,
            Username = nonFriend.Username,
            Name = nonFriend.Name,
            Country = nonFriend.Country,

            ProfilePicture = nonFriend.Image != null ? new ImageDto() {
                Data = nonFriend.Image.Data,
                ContentType = nonFriend.Image.ContentType,
            } : null,

            Elo = new EloDto() {
                Bullet = nonFriend.Elo.Bullet,
                Blitz = nonFriend.Elo.Blitz,
                Rapid = nonFriend.Elo.Rapid,
                Classic = nonFriend.Elo.Classic,
                Daily = nonFriend.Elo.Daily,
            },

            WdlTotal = new WinDrawLose() {
                Total = nonFriend.Stats.GamesPlayed,
                Wins = nonFriend.Stats.Wins,
                Draws = nonFriend.Stats.Draws,
                Loses = nonFriend.Stats.Loses,
            },

        }).ToList();

        var pagedResult = new PagedResult<GetAllNonFriendsDto>(nonFriendsDtos, nonFriendsDtos.Count, request.PageSize, request.PageNumber);

        return pagedResult;
    }
}