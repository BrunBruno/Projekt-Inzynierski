﻿
using chess.Core.Enums;
using MediatR;

namespace chess.Application.Requests.WebGameRequests.EndWebGame;

/// <summary>
/// Request for finishing the game, return winner color
/// </summary>
public class EndWebGameRequest : IRequest {

    /// <summary>
    /// Game id to end
    /// </summary>
    public Guid GameId { get; set; }

    /// <summary>
    /// Color of loser player (null if draw)
    /// </summary>
    public PieceColor? LoserColor { get; set; }

    /// <summary>
    /// The reason why game has ended
    /// </summary>
    public GameEndReason EndGameType { get; set; }

}
