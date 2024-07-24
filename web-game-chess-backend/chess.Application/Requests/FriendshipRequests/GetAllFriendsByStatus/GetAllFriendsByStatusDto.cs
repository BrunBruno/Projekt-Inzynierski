
using chess.Core.Dtos;

namespace chess.Application.Requests.FriendshipRequests.GetAllFriendsByStatus;

/// <summary>
/// Dto represent user, that has relationship established with current user
/// </summary>
public class GetAllFriendsByStatusDto : UserDto {

    /// <summary>
    /// Id of friendship
    /// </summary>
    public Guid FreindshpId { get; set; }

    /// <summary>
    /// Is friend a requstor or not
    /// </summary>
    public bool IsRequestor { get; set; }

    /// <summary>
    /// Games played together in friendship
    /// </summary>
    public int GamesPlayed { get; set; }

    /// <summary>
    /// Wins in friendship
    /// </summary>
    public int Wins { get; set; }

    /// <summary>
    /// Loses in friendship
    /// </summary>
    public int Loses { get; set; }

    /// <summary>
    /// Draws in friendship
    /// </summary>
    public int Draws { get; set; }

    /// <summary>
    /// Friends elo for all timing types
    /// </summary>
    public required EloDto Elo { get; set; }

}


