
using chess.Core.Enums;

namespace chess.Application.Requests.EngineRequests.GetEngineGameWinner;

/// <summary>
/// Dto returned to present engine game winner
/// </summary>
public class GetEngineGameWinnerDto {
    /// <summary>
    /// Winner color
    /// </summary>
    public PieceColor? WinnerColor { get; set; }
}
