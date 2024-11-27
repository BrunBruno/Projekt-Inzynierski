
using chess.Core.Enums;

namespace chess.Application.Requests.WebGameRequests.GetWinner;

/// <summary>
/// Dto returned to present web game winner
/// </summary>
public class GetWinnerDto {

    /// <summary>
    /// Winner color
    /// </summary>
    public PieceColor? WinnerColor { get; set; }

    /// <summary>
    /// Elo gained or lost after the game
    /// </summary>
    public int EloGain { get; set; }
}