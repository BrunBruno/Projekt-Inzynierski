
using chess.Application.Repositories;
using chess.Infrastructure.Contexts;
using chess.Infrastructure.Options;
using chess.Infrastructure.Repositories;
using chess.Shared.Options;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace chess.Infrastructure.InfrastructureExtensions;

public static class EFExtensions {

    public static IServiceCollection AddPostgres(this IServiceCollection services, IConfiguration configuration) {

        var options = configuration.GetOptions<PostgresOptions>("Postgres");

        services.AddDbContext<ChessAppDbContext>(ctx => ctx.UseNpgsql(options.ConnectionString));

        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IEmailVerificationCodeRepository, EmailVerificationCodeRepository>();

        return services;
    }
}
