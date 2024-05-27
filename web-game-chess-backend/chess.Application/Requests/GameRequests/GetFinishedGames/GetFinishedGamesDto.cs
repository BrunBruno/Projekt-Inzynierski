
using chess.Core.Enums;

namespace chess.Application.Requests.GameRequests.GetFinishedGames;

/// <summary>
/// Dto representing finished game
/// </summary>
public class GetFinishedGamesDto {

    /// <summary>
    /// Position at which game has ended
    /// </summary>
    public required string Position { get; set; }

    /// <summary>
    /// Number of both player moves
    /// </summary>
    public int Turn { get; set; }

    /// <summary>
    /// Number of rounds
    /// </summary>
    public int Moves { get; set; }

    /// <summary>
    /// Is user a winner or loser or draw
    /// </summary>
    public bool? IsWinner { get; set; }

    /// <summary>
    /// When game was created / played
    /// </summary>
    public DateTime CreatedAt { get; set; }

    /// <summary>
    /// Timing type of the game
    /// </summary>
    public TimingTypes TimingType { get; set; }

    /// <summary>
    /// Reason why game has ended
    /// </summary>
    public EndGameTypes? EndGameType { get; set; }  

    /// <summary>
    /// White player data
    /// </summary>
    public required GetFinishedGamesPlayerDto WhitePlayer { get; set; }

    /// <summary>
    /// Black player data
    /// </summary>
    public required GetFinishedGamesPlayerDto BlackPlayer { get; set; }
}

/// <summary>
/// Player data
/// </summary>
public class GetFinishedGamesPlayerDto {

    /// <summary>
    /// User name
    /// </summary>
    public required string Name { get; set; }

    /// <summary>
    /// Avatar
    /// </summary>
    public string? ImageUrl { get; set; }

    /// <summary>
    /// Elo points
    /// </summary>
    public int Elo { get; set; }
}