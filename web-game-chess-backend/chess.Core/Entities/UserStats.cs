
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
    /// Games outcomes
    /// </summary>
    public int OnlineWins { get; set; } = 0;
    public int OnlineDraws { get; set; } = 0;
    public int OnlineLoses { get; set; } = 0;

    /// <summary>
    /// All games played
    /// </summary>
    public int OnlineGamesPlayed => OnlineWins + OnlineLoses + OnlineDraws;

    
    /// <summary>
    /// Games played for each timing type
    /// </summary>
    public int BulletGamesPlayed {  get; set; } = 0;
    public int BlitzGamesPlayed { get; set; } = 0;
    public int RapidGamesPlayed { get; set; } = 0;
    public int ClassicGamesPlayed { get; set; } = 0;
    public int DailyGamesPlayed { get; set; } = 0;


    /// <summary>
    /// All wins by end reason
    /// </summary>
    public int WinsByCheckMate { get; set; } = 0;
    public int WinsByTimeout { get; set; } = 0;
    public int WinsByResignation { get; set; } = 0;

    /// <summary>
    /// All loses by end reason
    /// </summary>
    public int LosesByCheckMate { get; set; } = 0;
    public int LosesByTimeout { get; set; } = 0;
    public int LosesByResignation { get; set; } = 0;

    /// <summary>
    /// Games outcomes for offline games
    /// </summary>
    public int OfflineWins { get; set; } = 0;
    public int OfflineDraws { get; set; } = 0;
    public int OfflineLoses { get; set; } = 0;

    /// <summary>
    /// All games played
    /// </summary>
    public int OfflineGamesPlayed => OfflineWins + OfflineLoses + OfflineDraws;


    /// <summary>
    /// User id
    /// </summary>
    public Guid UserId { get; set; }

    /// <summary>
    /// User that stats belongs to
    /// </summary>
    public User User { get; set; }
}
