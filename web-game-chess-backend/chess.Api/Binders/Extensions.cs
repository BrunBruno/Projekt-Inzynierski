
using chess.Api.Binders.NullableBooleanList;

namespace chess.Api.Binders;

public static class Extensions {
    public static IServiceCollection AddCustomContollers(this IServiceCollection services) {

        services.AddControllers(options =>
        {
            options.ModelBinderProviders.Insert(0, new NullableBooleanListBinderProvider());
        });

        return services;
    }
}
