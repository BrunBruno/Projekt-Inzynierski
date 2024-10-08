﻿
using chess.Core.Enums;

namespace chess.Application.Requests.GameRequests.EndGame;

/// <summary>
/// Dto returned to present winner
/// </summary>
public class EndGameDto {

    /// <summary>
    /// Winner color
    /// </summary>
    public PieceColor? WinnerColor { get; set; }

    /// <summary>
    /// Elo gained or lost after the game
    /// </summary>
    public int EloGain { get; set; }
}
