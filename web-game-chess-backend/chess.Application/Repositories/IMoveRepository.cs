
using chess.Core.Entities;

namespace chess.Application.Repositories;

public interface IMoveRepository {
    Task Create(Move move);
}
