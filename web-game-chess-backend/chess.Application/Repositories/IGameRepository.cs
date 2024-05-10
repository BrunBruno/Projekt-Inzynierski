
using chess.Core.Entities;

namespace chess.Application.Repositories; 

public interface IGameRepository {
    Task<Game?> GetGameForPlayer(Guid playerId);
    Task<Game?> GetById(Guid id);
    Task Create(Game game);
}
