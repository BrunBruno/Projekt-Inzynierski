
using chess.Core.Dtos;

namespace chess.Application.Requests.EngineRequests.GetEngineGame;

public class GetEngineGameDto {

    public required string Position { get; set; }
    public int Turn { get; set; }
    public bool HasEnded { get; set; }

    public required PlayerDto Player { get; set; }

    public required List<MoveDto> Moves { get; set; }
}
