
using chess.Core.Entities;

namespace chess.Application.Repositories;

/// <summary>
/// Move repository
/// </summary>
public interface IMoveRepository {

    /// <summary>
    /// Creates new move for game
    /// </summary>
    /// <param name="move"></param>
    /// <returns></returns>
    Task Create(Move move);
}
