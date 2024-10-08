﻿
using chess.Application.Pagination;
using chess.Core.Enums;
using MediatR;

namespace chess.Application.Requests.FriendshipRequests.GetAllFriendsByStatus;

/// <summary>
/// Request to get all users that have established relationship with current user
/// </summary>
public class GetAllFriendsByStatusRequest : PagedRequest, IRequest<PagedResult<GetAllFriendsByStatusDto>> {

    /// <summary>
    /// Possibly provided username
    /// To filter thought users if not null
    /// </summary>
    public string? Username { get; set; }

    /// <summary>
    /// Status of relations, chosen by user 
    /// </summary>
    public FriendshipStatus Status { get; set; }

}
