
using chess.Api.Maps.MappingProfiles;

namespace chess.Api.Maps;

public static class Extensions {
    public static IServiceCollection AddMappingProfiles(this IServiceCollection services) {

        services.AddAutoMapper(typeof(UserMappingProfile));
        services.AddAutoMapper(typeof(GameMappingProfile));
        services.AddAutoMapper(typeof(FriendshipMappingProfile));
        services.AddAutoMapper(typeof(EngineMappingProfile));

        return services;
    }
}
