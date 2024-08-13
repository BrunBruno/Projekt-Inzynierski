
namespace chess.Core.Enums;

/// <summary>
/// Reasones types why game has eneded
/// </summary>
public enum EndGameTypes {
    CheckMate = 1,
    OutOfTime = 2,
    Resignation = 3,

    StaleMate = 4,
    Threefold = 5,
    Agreement = 6,
    FiftyMovesRule = 7,
    InsufficientMaterial = 8,
}