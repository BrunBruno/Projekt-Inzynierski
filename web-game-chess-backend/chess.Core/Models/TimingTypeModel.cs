
using chess.Core.Enums;

namespace chess.Core.Models;

/// <summary>
/// Abstract class for all request that creates new game
/// </summary>
public class TimingTypeModel {

    /// <summary>
    /// Type of timing
    /// </summary>
    private TimingTypes _type;
    public TimingTypes Type {
        get => _type;
        set => _type = value;
    }

    /// <summary>
    /// Duration of the game for one player
    /// Gets converted to seconds
    /// </summary>
    private int _minutes;
    public int Minutes {
        get => _minutes;
        set => SetMinutes(value);
    }

    /// <summary>
    /// Time increment for every done move
    /// </summary>
    private int _increment;
    public int Increment {
        get => _increment;
        set => SetIncrement(value);
    }

    private void SetMinutes(int minutes) {
        switch (_type) {
            case TimingTypes.Bullet:
                if (minutes >= 3 || minutes <= 0)
                    throw new ArgumentException("Bullet timing incorrect.");
                break;
                
            case TimingTypes.Blitz:
                if (minutes >= 10 || minutes < 3)
                    throw new ArgumentException("Blitz timing incorrect.");
                break;

            case TimingTypes.Rapid:
                if (minutes >= 60 || minutes < 10)
                    throw new ArgumentException("Rapid timing incorrect.");
                break;

            case TimingTypes.Classic:
                if (minutes >= 1440 || minutes < 60)
                    throw new ArgumentException("Classic timing incorrect.");
                break;

            case TimingTypes.Daily:
                if (minutes < 1440)
                    throw new ArgumentException("Daily timing incorrect.");
                break;

            default:
                throw new ArgumentException("Timing type not exists.");
        }

        _minutes = minutes;
    }

    private void SetIncrement(int increment) {

        if (increment > 60 || increment < 0)
            throw new ArgumentException("Increment set incorrect.");

        _increment = increment;
    }
}
