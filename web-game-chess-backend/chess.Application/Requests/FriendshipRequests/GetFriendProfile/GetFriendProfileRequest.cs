
using MediatR;

namespace chess.Application.Requests.FriendshipRequests.GetFriendProfile;

/// <summary>
/// Request to get detailed info about frend of current user
/// </summary>
public class GetFriendProfileRequest : IRequest<GetFriendProfileDto> {

    /// <summary>
    /// Id of frendshi[
    /// </summary>
    public Guid FriendshipId { get; set; }
}
