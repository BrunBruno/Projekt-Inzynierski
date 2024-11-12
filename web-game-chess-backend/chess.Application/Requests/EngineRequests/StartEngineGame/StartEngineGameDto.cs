
namespace chess.Application.Requests.EngineRequests.StartEngineGame;

/// <summary>
/// Dto returned after starting game with engine
/// </summary>
public class StartEngineGameDto {

    /// <summary>
    /// Create game id
    /// </summary>
    public Guid GameId { get; set; }
}
