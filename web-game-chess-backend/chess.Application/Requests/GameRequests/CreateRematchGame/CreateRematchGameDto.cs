
namespace chess.Application.Requests.GameRequests.CreateRematchGame;

/// <summary>
/// Ids returne ater reateing remach
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
