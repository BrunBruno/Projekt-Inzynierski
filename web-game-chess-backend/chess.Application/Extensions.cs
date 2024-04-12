
using AutoMapper;
using chess.Application.Authorization.IsVerified;
using chess.Application.MappingProfiles;
using chess.Core.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;

namespace chess.Application;

public static class Extensions {

    public static IServiceCollection AddApplication(this IServiceCollection services) {

        services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();
        services.AddScoped<IPasswordHasher<EmailVerificationCode>, PasswordHasher<EmailVerificationCode>>();

        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));

        services.AddAuthorization(options =>
        {
            options.AddPolicy("IsVerified", builder => builder.AddRequirements(new IsVerifiedRequirement(true)));
            options.AddPolicy("IsNotVerified", builder => builder.AddRequirements(new IsVerifiedRequirement(false)));
        });

        services.AddScoped<IAuthorizationHandler, IsVerifiedRequirementHandler>();

        services.AddAutoMapper(typeof(UserMappingProfile));

        return services;
    }
}