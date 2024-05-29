
namespace chess.Core.Entities;
#pragma warning disable CS8618

public class UserStats {
    public Guid Id { get; set; }

    public int Wins { get; set; } = 0;
    public int Loses { get; set; } = 0;
    public int Draws { get; set; } = 0;

    public int GamesPlayed => Wins + Loses + Draws;


    public int WinsByCheckMate { get; set; }
    public int WinsByTimeout { get; set; }
    public int WinsByResignation { get; set; }

    public int LosesByCheckMate { get; set; }
    public int LosesByTimeout { get; set; }
    public int LosesByResignation { get; set; }

    public Guid UserId { get; set; }
    public User User { get; set; }

}
