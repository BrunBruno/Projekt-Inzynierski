
using chess.Application.Services;
using chess.Infrastructure.Options;
using chess.Shared.Options;
using chess.Infrastructure.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using chess.Infrastructure.Contexts;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using chess.Infrastructure.Repositories.UserRepositories;
using chess.Application.Repositories.UserRepositories;
using chess.Infrastructure.Repositories.FriendshipRepositories;
using chess.Application.Repositories.FriendshipRepositories;
using chess.Application.Repositories.EngineGameRepositories;
using chess.Infrastructure.Repositories.EngineGameRepositories;
using chess.Infrastructure.Repositories.WebGameRepositories;
using chess.Application.Repositories.WebGameRepositories;
using chess.Infrastructure.Workers;


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
        services.AddScoped<IEngineService, EngineService>();
        services.AddScoped<IWebGamesFinisherService, WebGameFinisherService>();

        services.AddHostedService<WebGamesFinisherWorker>();

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

            cfg.Events = new JwtBearerEvents
            {
                OnMessageReceived = context => {

                    var accessToken = context.Request.Query["access_token"];
                    var path = context.HttpContext.Request.Path;

                    if (!string.IsNullOrEmpty(accessToken) && (path.StartsWithSegments("/game-hub"))) {
                        context.Token = accessToken;
                    }

                    return Task.CompletedTask;
                }
            };
        });

        return services;
    }


    private static IServiceCollection AddPostgres(this IServiceCollection services, IConfiguration configuration) {

        var options = configuration.GetOptions<PostgresOptions>("Postgres");

        services.AddDbContext<ChessAppDbContext>(ctx
            => ctx.UseNpgsql(options.ConnectionString));



        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IUserProfileImageRepository, UserProfileImageRepository>();
        services.AddScoped<IUserBackgroundImageRepository, UserBackgroundImageRepository>();
        services.AddScoped<IUserEloRepository, UserEloRepository>();
        services.AddScoped<IUserStatsRepository, UserStatsRepository>();
        services.AddScoped<IUserSettingsRepository, UserSettingsRepository>();
        services.AddScoped<IUserBanRepository, UserBanRepository>();
        services.AddScoped<IUserVerificationCodeRepository, UserVerificationCodeRepository>();
        services.AddScoped<IUserDataConfigurationRepository, UserDataConfigurationRepository>();

        services.AddScoped<IFriendshipRepository, FriendshipRepository>();
        services.AddScoped<IFriendshipStatsRepository, FriendshipStatsRepository>();

        services.AddScoped<IWebGameRepository, WebGameRepository>();
        services.AddScoped<IWebGameTimingRepository, WebGameTimingRepository>();
        services.AddScoped<IWebGameStateRepository, WebGameStateRepository>();
        services.AddScoped<IWebGameInvitationRepository, WebGameInvitationRepository>();
        services.AddScoped<IWebGameMessageRepository, WebGameMessageRepository>();
        services.AddScoped<IWebGameMoveRepository, WebGameMoveRepository>();
        services.AddScoped<IWebGamePlayerRepository, WebGamePlayerRepository>();
        services.AddScoped<IWebGamePlayerMessageRepository, WebGamePlayerMessageRepository>();

        services.AddScoped<IEngineGameRepository, EngineGameRepository>();
        services.AddScoped<IEngineGamePlayerRepository, EngineGamePlayerRepository>();
        services.AddScoped<IEngineGameMoveRepository, EngineGameMoveRepository>();
        services.AddScoped<IEngineGameMessageRepository, EngineGameMessageRepository>();

        return services;
    }
}
