
using chess.Core.Enums;

namespace chess.Application.Requests.WebGameRequests.EndWebGame;

/// <summary>
/// Dto returned to present winner
/// </summary>
public class EndWebGameDto {

    /// <summary>
    /// Winner color
    /// </summary>
    public PieceColor? WinnerColor { get; set; }

    /// <summary>
    /// Elo gained or lost after the game
    /// </summary>
    public int EloGain { get; set; }
}
