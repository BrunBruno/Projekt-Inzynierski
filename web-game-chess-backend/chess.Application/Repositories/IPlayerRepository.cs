
using chess.Core.Entities;

namespace chess.Application.Repositories;

public interface IPlayerRepository {

    Task<List<Player>> GetAllAvailablePlayersForTiming(Guid timingId);
    Task<Player?> GetById(Guid id);
    Task Create(Player player);
    Task Update(Player player);
    Task Delete(Player player);
}
