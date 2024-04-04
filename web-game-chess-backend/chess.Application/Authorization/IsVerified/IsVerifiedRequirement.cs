﻿
using Microsoft.AspNetCore.Authorization;

namespace chess.Application.Authorization.IsVerified;

public class IsVerifiedRequirement : IAuthorizationRequirement {

    public bool IsVerified { get; }

    public IsVerifiedRequirement(bool isVerified) {
        IsVerified = isVerified;
    }
}