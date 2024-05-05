
using chess.Core.Entities;

namespace chess.Application.Repositories;

/// <summary>
/// Banned user interface
/// </summary>
public interface IBannedUserRepository {

    /// <summary>
    /// Create banned user
    /// </summary>
    /// <param name="bannedUser"> User </param>
    /// <returns></returns>
    Task Create(BannedUser bannedUser);
}
