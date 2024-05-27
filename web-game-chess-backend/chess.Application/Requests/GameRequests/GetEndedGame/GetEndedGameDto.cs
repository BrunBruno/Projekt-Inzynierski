
using chess.Core.Enums;

namespace chess.Application.Requests.GameRequests.GetEndedGame;

/// <summary>
/// Dtp returned to get winner color for just eneded game
/// </summary>
public class GetEndedGameDto {

    /// <summary>
    /// Winner color (null when draw)
    /// </summary>
    public Colors? WinnerColor { get; set; }
}
