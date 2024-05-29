
using chess.Core.Entities;

namespace chess.Application.Repositories;

public interface IUserStatsRepository {
    Task Update(UserStats userStats);
}
