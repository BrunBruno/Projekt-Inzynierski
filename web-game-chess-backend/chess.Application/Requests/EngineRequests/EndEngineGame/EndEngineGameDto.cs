
using chess.Core.Enums;

namespace chess.Application.Requests.EngineRequests.EndEngineGame;

/// <summary>
/// Dto returned to present engine game winner
/// </summary>
public class EndEngineGameDto {

    /// <summary>
    /// Winner color
    /// </summary>
    public PieceColor? WinnerColor { get; set; }
}
