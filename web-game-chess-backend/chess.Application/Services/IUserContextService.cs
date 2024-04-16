
using System.Security.Claims;

namespace chess.Application.Services;

public interface IUserContextService {
    ClaimsPrincipal User { get; }
    Guid? GetUserId();
}