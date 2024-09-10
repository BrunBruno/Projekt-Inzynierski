
namespace chess.Core.Entities;
#pragma warning disable CS8618

/// <summary>
/// Use statistics entity
/// One to one user
/// </summary>
public class UserStats {

    /// <summary>
    /// Id
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// All wins
    /// </summary>
    public int Wins { get; set; } = 0;

    /// <summary>
    /// All loses
    /// </summary>
    public int Loses { get; set; } = 0;

    /// <summary>
    /// All draws
    /// </summary>
    public int Draws { get; set; } = 0;

    /// <summary>
    /// All games played
    /// </summary>
    public int GamesPlayed => Wins + Loses + Draws;


    /// <summary>
    /// All wins by checkmate
    /// </summary>
    public int WinsByCheckMate { get; set; }

    /// <summary>
    /// All wins by running oot of time
    /// </summary>
    public int WinsByTimeout { get; set; }

    /// <summary>
    /// All wins by resignation
    /// </summary>
    public int WinsByResignation { get; set; }

    /// <summary>
    /// All loses by checkmate
    /// </summary>
    public int LosesByCheckMate { get; set; }

    /// <summary>
    /// All loses by running oot of time
    /// </summary>
    public int LosesByTimeout { get; set; }

    /// <summary>
    /// All loses by resignation
    /// </summary>
    public int LosesByResignation { get; set; }

    /// <summary>
    /// User id
    /// </summary>
    public Guid UserId { get; set; }

    /// <summary>
    /// User that stats belongs to
    /// </summary>
    public User User { get; set; }
}
