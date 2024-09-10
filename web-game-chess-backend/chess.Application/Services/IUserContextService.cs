
using System.Security.Claims;

namespace chess.Application.Services;

/// <summary>
/// Service used for getting information from user context
/// </summary>
public interface IUserContextService {

    /// <summary>
    /// Gets user context.
    /// </summary>
    ClaimsPrincipal User { get; }

    /// <summary>
    /// Gets user id from user context
    /// </summary>
    /// <returns> user id </returns>
    Guid GetUserId();
}