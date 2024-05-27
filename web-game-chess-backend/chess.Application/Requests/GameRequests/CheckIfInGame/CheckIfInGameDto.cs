
namespace chess.Application.Requests.GameRequests.CheckIfInGame;

/// <summary>
/// Dto returned when checked if player is in game
/// </summary>
public class CheckIfInGameDto {

    /// <summary>
    /// Bool is in game
    /// </summary>
    public bool IsInGame { get; set; }

    /// <summary>
    /// Game id if player is in game, otherwise null
    /// </summary>
    public Guid? GameId { get; set; }
}
