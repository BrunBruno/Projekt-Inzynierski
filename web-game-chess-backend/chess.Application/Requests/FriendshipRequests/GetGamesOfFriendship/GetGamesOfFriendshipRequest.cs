
using chess.Application.Pagination;
using MediatR;

namespace chess.Application.Requests.FriendshipRequests.GetGamesOfFriendship;

/// <summary>
/// Request to get all games for friendship
/// </summary>
public class GetGamesOfFriendshipRequest : PagedRequest, IRequest<PagedResult<GetGamesOfFriendshipDto>> {

    /// <summary>
    /// Id of friendship
    /// </summary>
    public Guid FriendshipId { get; set; }
}
