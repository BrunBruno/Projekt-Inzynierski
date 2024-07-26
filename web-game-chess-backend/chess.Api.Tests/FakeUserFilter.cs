
using Microsoft.AspNetCore.Mvc.Filters;
using System.Security.Claims;

namespace chess.Api.Tests;

public class FakeUserFilter : IAsyncActionFilter {

    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next) {

        var claimsPrinicpal = new ClaimsPrincipal();

        claimsPrinicpal.AddIdentity(new ClaimsIdentity(
            new[]
            {
                new Claim(ClaimTypes.NameIdentifier, Constants.UserId),
                new Claim(ClaimTypes.Role, "User"),
                new Claim("IsVerified", true.ToString()),
            }
        ));

        context.HttpContext.User = claimsPrinicpal;

        await next();
    }
}
