
using chess.Application.Services;
using chess.Shared.Exceptions;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace chess.Infrastructure.Services;

public class UserContextService : IUserContextService {

    private readonly IHttpContextAccessor _httpContextAccessor;

    public UserContextService(IHttpContextAccessor httpContextAccessor) {
        _httpContextAccessor = httpContextAccessor;
    }

    ///<inheritdoc/>
    public ClaimsPrincipal User 
        => _httpContextAccessor.HttpContext!.User;

    ///<inheritdoc/>
    public Guid GetUserId() {
        if (User is null)
            throw new NotFoundException("User context not found.");

        var nameIdentifierClaim = User.FindFirst(c => c.Type == ClaimTypes.NameIdentifier) 
            ?? throw new Exception("NameIdentifier claim not found in user context.");

        return Guid.Parse(nameIdentifierClaim.Value);
    }
}
