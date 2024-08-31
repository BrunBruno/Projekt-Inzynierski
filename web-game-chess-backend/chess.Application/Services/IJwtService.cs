
using chess.Core.Entities;

namespace chess.Application.Services;

/// <summary>
/// Service for handling jwt tokens
/// </summary>
public interface IJwtService {

    /// <summary>
    /// Creates jwt token
    /// </summary>
    /// <param name="user"> User </param>
    /// <returns></returns>
    string GetJwtToken(User user);
}
