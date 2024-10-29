
namespace chess.Application.Requests.EngineRequests.MakeMoves;

public class MakeMovesDto {

    public required string NewPosition { get; set; }
    public int Turn {  get; set; }
}
