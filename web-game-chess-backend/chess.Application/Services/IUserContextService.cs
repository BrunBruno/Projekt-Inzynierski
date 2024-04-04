
using System.Security.Claims;

namespace chess.Application.Services;

public interface IUserContextService {
    Guid? GetUserId();
    ClaimsPrincipal User { get; }
}