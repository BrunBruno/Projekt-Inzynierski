
using chess.Core.Enums;

namespace chess.Application.Requests.GameRequests.EndGame;

/// <summary>
/// Dto returned to present winner
/// </summary>
public class EndGameDto {

    /// <summary>
    /// Winner color
    /// </summary>
    public Colors? WinnerColor { get; set; }
}
