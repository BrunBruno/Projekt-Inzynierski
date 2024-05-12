
namespace chess.Application.Requests.GameRequests.CheckIfInGame;

/// <summary>
/// 
/// </summary>
public class CheckIfInGameDto {

    /// <summary>
    /// 
    /// </summary>
    public bool IsInGame { get; set; }

    /// <summary>
    /// 
    /// </summary>
    public Guid? GameId { get; set; }
}
