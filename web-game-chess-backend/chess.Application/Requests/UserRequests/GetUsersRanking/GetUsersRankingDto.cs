
using chess.Core.Dtos;

namespace chess.Application.Requests.UserRequests.GetUsersRanking;

/// <summary>
/// Dto representing user in user ranking
/// </summary>
public class GetUsersRankingDto {

    /// <summary>
    /// Position in ranking
    /// </summary>
    public int Position { get; set; }

    /// <summary>
    /// Username
    /// </summary>
    public required string Username { get; set; }

    /// <summary>
    /// Elo for selected timing type
    /// </summary>
    public int Elo { get; set; }

    /// <summary>
    /// Total games played
    /// </summary>
    public int GamesPlayed { get; set; }

    /// <summary>
    /// Total games played for timing type
    /// </summary>
    public int TypeGamesPlayed { get; set; }

    /// <summary>
    /// Is user a current user
    /// </summary>
    public bool IsUser { get; set; }

    /// <summary>
    /// User profile picture
    /// </summary>
    public ImageDto? Profile { get; set; }
}
