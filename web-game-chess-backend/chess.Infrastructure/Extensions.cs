
using chess.Application.Services;
using chess.Infrastructure.Options;
using chess.Shared.Options;
using chess.Infrastructure.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using chess.Application.Repositories;
using chess.Infrastructure.Contexts;
using chess.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;

namespace chess.Infrastructure;

public static class Extensions {

    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration) {

        services.AddHttpContextAccessor();

        var postgresOptions = configuration.GetOptions<PostgresOptions>("Postgres");

        services.AddDbContext<ChessAppDbContext>(ctx => ctx.UseNpgsql(postgresOptions.ConnectionString));

        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IEmailVerificationCodeRepository, EmailVerificationCodeRepository>();
        services.AddScoped<IDataConfigurationRepository, DataConfigurationRepository>();
        services.AddScoped<IBannedUserRepository, BannedUserRepository>();

        var authenticationOptions = configuration.GetOptions<AuthenticationOptions>("Authentication");

        services.AddSingleton(authenticationOptions);

        services.AddAuthentication(option => {

            option.DefaultAuthenticateScheme = "Bearer";
            option.DefaultScheme = "Bearer";
            option.DefaultChallengeScheme = "Bearer";

        }).AddJwtBearer(cfg => {

            cfg.RequireHttpsMetadata = false;
            cfg.SaveToken = true;

            cfg.TokenValidationParameters = new TokenValidationParameters
            {
                ValidIssuer = authenticationOptions.JwtIssuer,
                ValidAudience = authenticationOptions.JwtIssuer,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(authenticationOptions.JwtKey!)),
            };
        });

        services.AddScoped<IJwtService, JwtService>();

        services.AddCors(options => {
            options.AddPolicy("FrontEndClient", builder => {
                builder.AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowAnyOrigin();
            });
        });

        services.AddScoped<IUserContextService, UserContextService>();

        var smtpOptions = configuration.GetOptions<SmtpOptions>("Smtp");
        services.AddSingleton(smtpOptions);

        services.AddScoped<ISmtpService, SmtpService>();


        return services;
    }
}
