
using chess.Core.Dtos;

namespace chess.Application.Requests.FriendshipRequests.GetFriendProfile;

/// <summary>
/// Dto representing friends of current user
/// </summary>
public class GetFriendProfileDto : UserDto {

    /// <summary>
    /// Friend profile description
    /// </summary>
    public string? Bio { get; set; }

    /// <summary>
    /// Account creation date
    /// </summary>
    public DateTime JoinDate { get; set; }

    /// <summary>
    /// Friendship acceptation date
    /// </summary>
    public DateTime? FriendsSince { get; set; }

    /// <summary>
    /// Friend elo for all timing types
    /// </summary>
    public required EloDto Elo { get; set; }

    /// <summary>
    /// Win, loses nad draws in total
    /// </summary>
    public required GameOutcomeDto OutcomeTotal { get; set; }

    /// <summary>
    ///  Win, loses nad draws in relationship
    /// </summary>
    public required GameOutcomeDto OutcomeTogether { get; set; }
}
