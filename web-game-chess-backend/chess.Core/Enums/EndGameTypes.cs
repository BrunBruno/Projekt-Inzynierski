﻿
namespace chess.Core.Enums;

/// <summary>
/// Reasons types why game has ended
/// </summary>
public enum EndGameTypes {
    // wins / loses causes
    CheckMate = 1,
    OutOfTime = 2,
    Resignation = 3,
    // draws causes
    StaleMate = 4,
    Threefold = 5,
    Agreement = 6,
    FiftyMovesRule = 7,
    InsufficientMaterial = 8,
}