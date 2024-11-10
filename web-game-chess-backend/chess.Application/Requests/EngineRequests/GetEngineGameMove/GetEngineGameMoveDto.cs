
namespace chess.Application.Requests.EngineRequests.GetEngineGameMove;

public class GetEngineGameMoveDto {

    public bool ShouldEnd { get; set; } = false;
    public required string OldCoordinates {  get; set; }
    public required string NewCoordinates { get; set; }
    public string? PromotedPiece { get; set; }
}
