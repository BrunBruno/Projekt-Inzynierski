
using chess.Infrastructure.Options;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using chess.Shared.Options;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace chess.Infrastructure.Jwt; 

public static class Extensions {
    public static IServiceCollection AddJwt(this IServiceCollection services, IConfiguration configuration) {

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
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(options.JwtKey)),

            };
        });

        return services;
    }
}
