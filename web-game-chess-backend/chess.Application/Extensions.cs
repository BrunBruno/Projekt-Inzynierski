﻿
using chess.Application.Authorization.IsVerified;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;

namespace chess.Application;

public static class Extensions {

    public static IServiceCollection AddApplication(this IServiceCollection services) {

        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));

        //services.AddAuthorization(options =>
        //{
         //   options.AddPolicy("IsVerified", builder => builder.AddRequirements(new IsVerifiedRequirement(true)));
        //    options.AddPolicy("IsNotVerified", builder => builder.AddRequirements(new IsVerifiedRequirement(false)));
        //});

        //services.AddScoped<IAuthorizationHandler, IsVerifiedRequirementHandler>();

        return services;
    }
}
