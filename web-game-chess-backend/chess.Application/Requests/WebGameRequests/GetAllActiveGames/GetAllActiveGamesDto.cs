
using chess.Core.Dtos;
using chess.Core.Enums;

namespace chess.Application.Requests.WebGameRequests.GetAllActiveGames;

/// <summary>
/// Dto representing ongoing game
/// </summary>
public class GetAllActiveGamesDto {

    /// <summary>
    /// Id for rejoining
    /// </summary>
    public Guid GameId { get; set; }

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
    /// When game was created / played
    /// </summary>
    public DateTime CreatedAt { get; set; }

    /// <summary>
    /// Timing type of the game
    /// </summary>
    public TimingTypes TimingType { get; set; }

    /// <summary>
    /// Time left for current player
    /// </summary>
    public double TimeLeft { get; set; }

    /// <summary>
    /// White player data
    /// </summary>
    public required PlayerDto WhitePlayer { get; set; }

    /// <summary>
    /// Black player data
    /// </summary>
    public required PlayerDto BlackPlayer { get; set; }
}