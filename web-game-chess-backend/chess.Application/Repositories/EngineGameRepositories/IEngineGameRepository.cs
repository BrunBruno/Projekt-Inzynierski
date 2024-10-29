using chess.Core.Entities;

namespace chess.Application.Repositories.EngineGameRepositories;

public interface IEngineGameRepository
{

    public Task<EngineGame?> GetById(Guid gameId);
    public Task Create(EngineGame game);
}
