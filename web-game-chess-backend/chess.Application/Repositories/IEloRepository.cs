
using chess.Core.Entities;

namespace chess.Application.Repositories; 
public interface IEloRepository {
    Task Update(Elo elo);
}
