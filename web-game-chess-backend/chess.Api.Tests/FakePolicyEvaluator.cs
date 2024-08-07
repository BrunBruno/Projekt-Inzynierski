﻿
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Policy;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace chess.Api.Tests;

public class FakePolicyEvaluator : IPolicyEvaluator {

    public Task<AuthenticateResult> AuthenticateAsync(AuthorizationPolicy policy, HttpContext context) {

        var claimsPrincipal = new ClaimsPrincipal();
        var ticket = new AuthenticationTicket(claimsPrincipal, "Test");
        var result = AuthenticateResult.Success(ticket);

        return Task.FromResult(result);
    }

    public Task<PolicyAuthorizationResult> AuthorizeAsync(AuthorizationPolicy policy, AuthenticateResult authenticateResult, HttpContext context, object? resource) {

        var result = PolicyAuthorizationResult.Success();

        return Task.FromResult(result);
    }
}
