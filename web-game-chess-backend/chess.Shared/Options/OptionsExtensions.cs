
using Microsoft.Extensions.Configuration;

namespace chess.Shared.Options;

public static class OptionsExtensions {

    /// <summary>
    /// Gets data from appsettings
    /// </summary>
    /// <param name="configuration"> Configuration </param>
    /// <param name="sectionName"> Name of section </param>
    /// <returns> Data from appsettings </returns>
    public static TOptions GetOptions<TOptions>(this IConfiguration configuration, string sectionName) where TOptions : new() {

        var options = new TOptions();

        configuration.GetSection(sectionName).Bind(options);

        return options;
    }
}
