
using chess.Core.Dtos;

namespace chess.Application.Requests.FriendshipRequests.GetAllNonFriends;

/// <summary>
/// Dto represent user, that don't have relation with current user
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

    /// <summary>
    /// Win, loses nad draws in total
    /// </summary>
    public required GameOutcomeDto OutcomeTotal { get; set; }
}
