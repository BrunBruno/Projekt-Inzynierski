
using chess.Core.Dtos;

namespace chess.Application.Requests.FriendshipRequests.GetFriendProfile;

/// <summary>
/// Dto representing freinds of current user
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
    /// Wins for requestor of freindship
    /// </summary>
    public int RequestorWins { get; set; }

    /// <summary>
    /// Loses for requestor of freindship
    /// </summary>
    public int RequestorLoses { get; set; }

    /// <summary>
    /// Draws for requestor of freindship
    /// </summary>
    public int RequestorDraws { get; set; }

    /// <summary>
    /// All games that was played in friendship
    /// </summary>
    public int GamesPlayedTogether { get; set; }

    /// <summary>
    /// All games played in general by friend
    /// </summary>
    public int GamesPlayed { get; set; }

    /// <summary>
    /// Friend elo for all timing types
    /// </summary>
    public required EloDto Elo { get; set; }
}
