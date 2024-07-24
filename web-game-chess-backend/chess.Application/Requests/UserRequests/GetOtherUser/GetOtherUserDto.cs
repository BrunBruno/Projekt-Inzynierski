
using chess.Core.Dtos;

namespace chess.Application.Requests.UserRequests.GetOtherUser;

/// <summary>
/// User dto
/// </summary>
public class GetOtherUserDto : UserDto {

    /// <summary>
    /// Account creation date
    /// </summary>
    public DateTime JoinDate { get; set; }

    /// <summary>
    /// Bio
    /// </summary>
    public string? Bio { get; set; }

    /// <summary>
    /// Total games played
    /// </summary>
    public int GamesPlayed { get; set; }
}
