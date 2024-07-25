
namespace chess.Application.Requests.GameRequests.GetTypeHistory;

/// <summary>
/// Dto for timing type history
/// </summary>
public class GetTypeHistoryDto {

    /// <summary>
    /// White player username
    /// </summary>
    public required string WhitePlayer { get; set; }

    /// <summary>
    /// Black player username
    /// </summary>
    public required string BlackPlayer { get; set; }

    /// <summary>
    /// Number of done moves
    /// </summary>
    public int Moves { get; set; }

    /// <summary>
    /// Is curret user a winner
    /// </summary>
    public bool? IsWinner { get; set; }

    /// <summary>
    /// Previous elo points of user
    /// </summary>
    public int PrevElo { get; set; }

    /// <summary>
    /// Creeation date
    /// </summary>
    public DateTime CreatedAt { get; set; }
}
