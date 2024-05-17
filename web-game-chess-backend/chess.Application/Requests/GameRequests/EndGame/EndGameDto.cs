
using chess.Core.Enums;

namespace chess.Application.Requests.GameRequests.EndGame;

public class EndGameDto {
    public Colors? Winner { get; set; }
}
