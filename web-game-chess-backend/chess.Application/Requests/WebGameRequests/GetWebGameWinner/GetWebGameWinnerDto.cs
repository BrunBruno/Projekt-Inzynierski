﻿
using chess.Core.Enums;

namespace chess.Application.Requests.WebGameRequests.GetWebGameWinner;

/// <summary>
/// Dto returned to present web game winner
/// </summary>
public class GetWebGameWinnerDto {

    /// <summary>
    /// Winner color
    /// </summary>
    public PieceColor? WinnerColor { get; set; }

    /// <summary>
    /// Elo gained or lost after the game
    /// </summary>
    public int EloGain { get; set; }

    /// <summary>
    /// Reason why game has ended
    /// </summary>
    public GameEndReason GameEndReason { get; set; }
}