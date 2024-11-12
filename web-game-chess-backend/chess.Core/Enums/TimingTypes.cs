
namespace chess.Core.Enums;

/// <summary>
/// Types of timings
/// Bullet - max 3 min
/// Blitz - max 10 min
/// Rapid - max 1h
/// Classic - max 1d
/// Daily - longer then 1 day
/// </summary>
public enum TimingTypes {
    Bullet = 1,
    Blitz = 2,
    Rapid = 3,
    Classic = 4,
    Daily = 5
}

