
using chess.Core.Entities;
using chess.Core.Enums;
using chess.Core.Maps;

namespace chess.Core.Extensions;

public static class EloExtensions {
    public static int GetElo(this Elo elo, TimingTypes type) {
        return EloMap.EloMapping[type].Get(elo);
    }

    public static void SetElo(this Elo elo, TimingTypes type, int value) {
        EloMap.EloMapping[type].Set(elo, value);
    }

    public static void UpdateElo(this Elo elo, TimingTypes type, int change) {
        EloMap.EloMapping[type].Update(elo, change);
    }
}
