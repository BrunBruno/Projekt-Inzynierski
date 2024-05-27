
namespace chess.Core.Enums;

/// <summary>
/// Types of timings
/// Bullet - max 3 min
/// Blitz - max 10 min
/// Rapid - max 1h
/// Classic - max 1d
/// Dayli - longer then 1 day
/// </summary>
public enum TimingTypes {
    Bullet = 0,
    Blitz = 1,
    Rapid = 2,
    Classic = 3,
    Dayli = 4
}

