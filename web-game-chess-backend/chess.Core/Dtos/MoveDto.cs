﻿
namespace chess.Core.Dtos;

/// <summary>
/// Done move
/// </summary>
public class MoveDto {

    /// <summary>
    /// Done move in form: 
    /// piece tag + x (if capture) + coordinates xy + # if check
    /// </summary>
    public required string Move { get; set; }

    /// <summary>
    /// Turn at which move was made
    /// </summary>
    public int Turn { get; set; }

    /// <summary>
    /// Coordinates from
    /// </summary>
    public required string OldCoor { get; set; }

    /// <summary>
    /// Coordinates to
    /// </summary>
    public required string NewCoor { get; set; }

    /// <summary>
    /// Capture piece tag
    /// </summary>
    public string? CapturedPiece { get; set; }
}