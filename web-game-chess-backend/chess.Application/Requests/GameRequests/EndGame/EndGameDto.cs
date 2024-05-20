
using chess.Core.Enums;

namespace chess.Application.Requests.GameRequests.EndGame;

public class EndGameDto {
    public Colors? WinnerColor { get; set; }
}
