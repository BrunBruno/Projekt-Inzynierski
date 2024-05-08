
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

        var smtpOptions = configuration.GetOptions<SmtpOptions>("Smtp");
        services.AddSingleton(smtpOptions);

        services.AddHttpContextAccessor();

        services.AddPostgres(configuration);

        services.AddJwt(configuration);

        services.AddCors(options => {
            options.AddPolicy("FrontEndClient", builder => {
                builder.AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowAnyOrigin();
            });
        });

        services.AddScoped<IJwtService, JwtService>();
        services.AddScoped<ISmtpService, SmtpService>();
        services.AddScoped<IUserContextService, UserContextService>();

        return services;
    }

    private static IServiceCollection AddJwt(this IServiceCollection services, IConfiguration configuration) {

        var options = configuration.GetOptions<AuthenticationSettings>("Authentication");

        services.AddSingleton(options);

        services.AddAuthentication(option =>
        {
            option.DefaultAuthenticateScheme = "Bearer";
            option.DefaultScheme = "Bearer";
            option.DefaultChallengeScheme = "Bearer";
        }).AddJwtBearer(cfg =>
        {
            cfg.RequireHttpsMetadata = false;
            cfg.SaveToken = true;
            cfg.TokenValidationParameters = new TokenValidationParameters
            {
                ValidIssuer = options.JwtIssuer,
                ValidAudience = options.JwtIssuer,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(options.JwtKey!)),

            };
        });

        return services;
    }

    private static IServiceCollection AddPostgres(this IServiceCollection services, IConfiguration configuration) {

        var options = configuration.GetOptions<PostgresOptions>("Postgres");

        services.AddDbContext<ChessAppDbContext>(ctx
            => ctx.UseNpgsql(options.ConnectionString));

        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IEmailVerificationCodeRepository, EmailVerificationCodeRepository>();
        services.AddScoped<IDataConfigurationRepository, DataConfigurationRepository>();
        services.AddScoped<IBannedUserRepository, BannedUserRepository>();
        services.AddScoped<IGameRepository, GameRepository>();
        services.AddScoped<IPlayerRepository, PlayerRepository>();

        return services;
    }
}
