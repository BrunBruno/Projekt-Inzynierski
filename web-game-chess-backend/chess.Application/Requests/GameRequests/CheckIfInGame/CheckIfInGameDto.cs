
namespace chess.Application.Requests.GameRequests.CheckIfInGame;

public class CheckIfInGameDto {
    public bool IsInGame { get; set; }
    public Guid? GameId { get; set; }
}
