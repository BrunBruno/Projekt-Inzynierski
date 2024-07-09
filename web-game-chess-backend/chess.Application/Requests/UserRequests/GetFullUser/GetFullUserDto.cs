
namespace chess.Application.Requests.UserRequests.GetFullUser;

public class GetFullUserDto {
    public required string Email { get; set; }
    public required string Username { get; set; }
    public string? Name { get; set; }
    public DateTime JoinDate { get; set; }
    public string? ImageUrl { get; set; }
    public required string Country { get; set; }

    public int Wins { get; set; } 
    public int Loses { get; set; } 
    public int Draws { get; set; } 
    public int GamesPlayed { get; set; }


    public int WinsByCheckMate { get; set; }
    public int WinsByTimeout { get; set; }
    public int WinsByResignation { get; set; }

    public int LosesByCheckMate { get; set; }
    public int LosesByTimeout { get; set; }
    public int LosesByResignation { get; set; }
}
