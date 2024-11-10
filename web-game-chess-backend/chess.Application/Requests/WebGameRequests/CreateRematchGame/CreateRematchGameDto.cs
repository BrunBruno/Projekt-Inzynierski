
namespace chess.Application.Requests.WebGameRequests.CreateRematchGame;

/// <summary>
/// Ids returned after taking rematch
/// </summary>
public class CreateRematchGameDto {

    /// <summary>
    /// Opponent username
    /// </summary>
    public required string OpponentName { get; set; }

    /// <summary>
    /// Game id
    /// </summary>
    public Guid GameId { get; set; }
}
