
using chess.Core.Entities;

namespace chess.Application.Repositories.EngineGameRepositories;

public interface IEngineGameMoveRepository {

    Task Create(EngineGameMove move);
}
