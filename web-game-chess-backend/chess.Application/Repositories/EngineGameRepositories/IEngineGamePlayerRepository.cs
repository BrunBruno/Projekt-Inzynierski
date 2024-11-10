
using chess.Core.Entities;

namespace chess.Application.Repositories.EngineGameRepositories;

public interface IEngineGamePlayerRepository {

    Task Create(EngineGamePlayer player);
}
