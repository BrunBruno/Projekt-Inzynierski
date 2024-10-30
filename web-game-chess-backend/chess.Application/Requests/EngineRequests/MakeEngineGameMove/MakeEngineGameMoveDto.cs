
namespace chess.Application.Requests.EngineRequests.MakeEngineGameMove;

public class MakeEngineGameMoveDto {

    public required string NewPosition { get; set; }
    public int Turn {  get; set; }

    public List<string> Outputs { get; set; }
}
