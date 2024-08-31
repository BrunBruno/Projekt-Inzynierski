
using MediatR;

namespace chess.Application.Requests.FriendshipRequests.GetFriendProfile;

/// <summary>
/// Request to get detailed info about friend of current user
/// </summary>
public class GetFriendProfileRequest : IRequest<GetFriendProfileDto> {

    /// <summary>
    /// Id of friendship
    /// </summary>
    public Guid FriendshipId { get; set; }
}
