
using chess.Core.Entities;

namespace chess.Application.Repositories; 

public interface IGameRepository {
    Task Create(Game game);
}
