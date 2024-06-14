
using chess.Core.Entities;
using chess.Core.Enums;

namespace chess.Core.Maps;

public static class EloMap {
    public static readonly Dictionary<TimingTypes, (Func<Elo, int> Get, Action<Elo, int> Set, Action<Elo, int> Update)> EloMapping = new()
    {
        { 
            TimingTypes.Bullet,
            (elo => elo.Bullet, (elo, value) => elo.Bullet = value, (elo, change) => elo.Bullet += change) 
        },
        { 
            TimingTypes.Blitz,
            (elo => elo.Blitz, (elo, value) => elo.Blitz = value, (elo, change) => elo.Blitz += change) 
        },
        { 
            TimingTypes.Rapid,
            (elo => elo.Rapid, (elo, value) => elo.Rapid = value, (elo, change) => elo.Rapid += change) 
        },
        {
            TimingTypes.Classic,
            (elo => elo.Classic, (elo, value) => elo.Classic = value, (elo, change) => elo.Classic += change)
        },
        {
            TimingTypes.Dayli,
            (elo => elo.Dayli, (elo, value) => elo.Dayli = value, (elo, change) => elo.Dayli += change)
        }
    };
}
