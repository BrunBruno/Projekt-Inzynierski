
using chess.Core.Entities;

namespace chess.Application.Repositories;

/// <summary>
/// Banned user interface
/// </summary>
public interface IUserBanRepository {

    /// <summary>
    /// Create banned user
    /// </summary>
    /// <param name="bannedUser"> User </param>
    /// <returns></returns>
    Task Create(UserBan bannedUser);
}
