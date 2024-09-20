
using chess.Core.Entities;
using chess.Core.Enums;

namespace chess.Core.Maps.MapOfElo;

public static class EloExtensions {

    public static int GetElo(this UserElo elo, TimingTypes type) { 
        return EloMap.EloMapping[type].Get(elo);
    }

    public static void SetElo(this UserElo elo, TimingTypes type, int value) {

        EloMap.EloMapping[type].Set(elo, value);
    }

    public static void UpdateElo(this UserElo elo, TimingTypes type, int change) {

        EloMap.EloMapping[type].Update(elo, change);
    }
}
