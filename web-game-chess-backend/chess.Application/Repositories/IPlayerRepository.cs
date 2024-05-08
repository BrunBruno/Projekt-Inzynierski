
using chess.Core.Entities;

namespace chess.Application.Repositories;

public interface IPlayerRepository {

    Task<List<Player>> GetAllAvailablePlayers();
    Task<Player?> GetById(Guid id);
    Task Create(Player player);
    Task Update(Player player);
    Task Delete(Player player);
}
