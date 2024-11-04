
namespace chess.Application.Requests.EngineRequests.GetEngineGameMove;

public class GetEngineGameMoveDto {

    public required string OldCoordinates {  get; set; }
    public required string NewCoordinates { get; set; }
    public string? PromotedPiece { get; set; }
}
