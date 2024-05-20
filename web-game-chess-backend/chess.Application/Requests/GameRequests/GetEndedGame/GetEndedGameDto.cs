
using chess.Core.Enums;

namespace chess.Application.Requests.GameRequests.GetEndedGame;

public class GetEndedGameDto {
    public Colors? WinnerColor { get; set; }
}
