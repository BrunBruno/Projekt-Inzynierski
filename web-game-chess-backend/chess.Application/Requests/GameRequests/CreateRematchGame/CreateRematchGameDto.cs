
namespace chess.Application.Requests.GameRequests.CreateRematchGame;

/// <summary>
/// Ids returned after taking rematch
/// </summary>
public class CreateRematchGameDto {

    /// <summary>
    /// Opponent id
    /// </summary>
    public Guid OpponentId { get; set; }

    /// <summary>
    /// Game id
    /// </summary>
    public Guid GameId { get; set; }
}
