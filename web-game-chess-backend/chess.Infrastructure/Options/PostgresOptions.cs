﻿
namespace chess.Infrastructure.Options;

/// <summary>
/// Settings for Postgres
/// </summary>
public class PostgresOptions {

    /// <summary>
    /// Connection string
    /// </summary>
    public string? ConnectionString { get; set; }
}
