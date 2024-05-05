
using Microsoft.AspNetCore.Authorization;

namespace chess.Api.Authorization.IsVerified;

public class IsVerifiedRequirementHandler : AuthorizationHandler<IsVerifiedRequirement> {
    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, IsVerifiedRequirement requirement) {

        var isVerifiedClaim = context.User?.FindFirst(c => c.Type == "IsVerified");

        if (isVerifiedClaim != null) {
            var isVerified = bool.Parse(isVerifiedClaim.Value);

            if (isVerified == requirement.IsVerified) {
                context.Succeed(requirement);
            }
        }

        return Task.CompletedTask;
    }
}
