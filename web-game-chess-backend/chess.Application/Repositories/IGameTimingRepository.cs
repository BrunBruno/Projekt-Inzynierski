
using chess.Core.Entities;
using chess.Core.Enums;

namespace chess.Application.Repositories;

public interface IGameTimingRepository {
    Task<GameTiming?> FindTiming(TimingTypes type, int minutes, int increment);
    Task Create(GameTiming gameTiming);
}
