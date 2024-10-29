
using chess.Core.Entities;

namespace chess.Application.Repositories.WebGameRepositories;

/// <summary>
/// Game state repository
/// </summary>
public interface IWebGameStateRepository {

    /// <summary>
    /// Creates new game stats for game
    /// </summary>
    /// <param name="gameState"></param>
    /// <returns></returns>
    Task Create(WebGameState gameState);
}
