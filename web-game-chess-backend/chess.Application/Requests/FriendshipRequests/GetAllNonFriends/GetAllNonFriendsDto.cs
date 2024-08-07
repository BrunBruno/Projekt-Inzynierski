﻿
using chess.Core.Dtos;

namespace chess.Application.Requests.FriendshipRequests.GetAllNonFriends;

/// <summary>
/// Dto represent user, that dont have relation with current user
/// </summary>
public class GetAllNonFriendsDto : UserDto {

    /// <summary>
    /// User id
    /// </summary>
    public Guid UserId { get; set; }

    /// <summary>
    /// User elo for all timing types
    /// </summary>
    public required EloDto Elo { get; set; }
}
