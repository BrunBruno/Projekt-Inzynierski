
using chess.Core.Dtos;

namespace chess.Application.Requests.UserRequests.GetFullUser;

/// <summary>
/// Dto of user
/// </summary>
public class GetFullUserDto : UserDto {

    /// <summary>
    /// Email
    /// </summary>
    public required string Email { get; set; }

    /// <summary>
    /// Account creation date
    /// </summary>
    public DateTime JoinDate { get; set; }

    /// <summary>
    /// Profile description/biography
    /// </summary>
    public string? Bio { get; set; }

    /// <summary>
    /// Total user wins
    /// </summary>
    public int Wins { get; set; } 

    /// <summary>
    /// Total user loses
    /// </summary>
    public int Loses { get; set; } 

    /// <summary>
    /// Total user draws
    /// </summary>
    public int Draws { get; set; } 

    /// <summary>
    /// Total games played
    /// </summary>
    public int GamesPlayed { get; set; }


    /// <summary>
    /// Wins by some win option
    /// </summary>
    public int WinsByCheckMate { get; set; }
    public int WinsByTimeout { get; set; }
    public int WinsByResignation { get; set; }

    /// <summary>
    /// Loses by some win option
    /// </summary>
    public int LosesByCheckMate { get; set; }
    public int LosesByTimeout { get; set; }
    public int LosesByResignation { get; set; }
}
