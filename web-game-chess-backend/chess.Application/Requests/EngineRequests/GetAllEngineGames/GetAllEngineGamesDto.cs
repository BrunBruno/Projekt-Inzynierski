
using chess.Core.Dtos;
using chess.Core.Enums;

namespace chess.Application.Requests.EngineRequests.GetAllEngineGames;

public class GetAllEngineGamesDto {

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
    /// Is user a winner or loser or draw
    /// </summary>
    public bool? IsWinner { get; set; }

    /// <summary>
    /// Elo gained or lost after game
    /// </summary>
    public int EloGained { get; set; }

    /// <summary>
    /// When game was created / played
    /// </summary>
    public DateTime CreatedAt { get; set; }

    /// <summary>
    /// Reason why game has ended
    /// </summary>
    public GameEndReason? EndGameType { get; set; }

    /// <summary>
    /// White player data
    /// </summary>
    public required PlayerDto WhitePlayer { get; set; }

    /// <summary>
    /// Black player data
    /// </summary>
    public required PlayerDto BlackPlayer { get; set; }
}
