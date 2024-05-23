﻿
using chess.Shared.Middleware;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

namespace chess.Shared;

public static class Extensions {

    public static IServiceCollection AddShared(this IServiceCollection services) {

        services.AddScoped<ExceptionMiddleware>();

        return services;
    }


    public static IApplicationBuilder UseShared(this IApplicationBuilder app) {

        app.UseMiddleware<ExceptionMiddleware>();

        return app;
    }
}
