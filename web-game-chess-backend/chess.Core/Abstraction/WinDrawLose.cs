﻿
namespace chess.Core.Abstraction;

/// <summary>
/// Abstrac class to represent all results
/// </summary>
public class WinDrawLose {

    /// <summary>
    /// Total games played
    /// </summary>
    public int Total { get; set; }

    /// <summary>
    /// Result of each games
    /// </summary>
    public int Wins { get; set; }
    public int Draws { get; set; }
    public int Loses { get; set; }
}