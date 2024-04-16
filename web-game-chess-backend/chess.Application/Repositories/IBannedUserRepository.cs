
using chess.Core.Entities;

namespace chess.Application.Repositories;

public interface IBannedUserRepository {
    Task Create(BannedUser bannedUser);
}
