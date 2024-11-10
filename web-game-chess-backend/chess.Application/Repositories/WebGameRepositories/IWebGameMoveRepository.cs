
using chess.Core.Entities;

namespace chess.Application.Repositories.WebGameRepositories;

/// <summary>
/// Move repository
/// </summary>
public interface IWebGameMoveRepository {

    /// <summary>
    /// Creates new move for game
    /// </summary>
    /// <param name="move"></param>
    /// <returns></returns>
    Task Create(WebGameMove move);
}
