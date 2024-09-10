
using chess.Core.Abstraction;
using chess.Core.Dtos;

namespace chess.Application.Requests.FriendshipRequests.GetAllFriendsByStatus;

/// <summary>
/// Dto represent user, that has relationship established with current user
/// </summary>
public class GetAllFriendsByStatusDto : UserDto {

    /// <summary>
    /// Id of friendship
    /// </summary>
    public Guid FriendshipId { get; set; }

    /// <summary>
    /// Is friend a requestor or not
    /// </summary>
    public bool IsRequestor { get; set; }

    /// <summary>
    /// Friends elo for all timing types
    /// </summary>
    public required EloDto Elo { get; set; }

    /// <summary>
    /// Win, loses nad draws in total
    /// </summary>
    public required WinDrawLose WdlTotal { get; set; }

    /// <summary>
    ///  Win, loses nad draws in relationship
    /// </summary>
    public required WinDrawLose WdlTogether { get; set; }
}


