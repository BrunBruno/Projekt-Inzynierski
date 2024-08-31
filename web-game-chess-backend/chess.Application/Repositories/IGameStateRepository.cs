
using chess.Core.Entities;

namespace chess.Application.Repositories;

/// <summary>
/// Game state repository
/// </summary>
public interface IGameStateRepository {

    /// <summary>
    /// Creates new game stats for game
    /// </summary>
    /// <param name="gameState"></param>
    /// <returns></returns>
    Task Create(GameState gameState);
}
