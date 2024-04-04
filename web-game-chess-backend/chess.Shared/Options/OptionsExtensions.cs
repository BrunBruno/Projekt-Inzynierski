﻿
using Microsoft.Extensions.Configuration;

namespace chess.Shared.Options; 
public static class OptionsExtensions {

    public static TOptions GetOptions<TOptions>(this IConfiguration configuration, string sectionName) where TOptions : new() {
        var options = new TOptions();
        configuration.GetSection(sectionName).Bind(options);

        return options;
    }
}
