
using chess.Core.Enums;

namespace chess.Application.Requests.GameRequests.GetEndedGame;

/// <summary>
/// Dtp returned to get winner color for just ended game
/// </summary>
public class GetEndedGameDto {

    /// <summary>
    /// Winner color (null when draw)
    /// </summary>
    public PieceColor? WinnerColor { get; set; }

    /// <summary>
    /// Elo gained or lost after the game
    /// </summary>
    public int EloGain { get; set; }
}
