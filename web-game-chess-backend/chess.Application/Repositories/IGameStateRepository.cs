
using chess.Core.Entities;

namespace chess.Application.Repositories;

public interface IGameStateRepository {
    Task Create(GameState gameState);
}
