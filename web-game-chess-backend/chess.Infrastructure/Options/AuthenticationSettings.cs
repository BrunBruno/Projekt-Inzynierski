
namespace chess.Infrastructure.Options;

/// <summary>
/// Settings for JWT authentication.
/// </summary>
public class AuthenticationSettings {

    /// <summary>
    /// Jwt private key
    /// </summary>
    public  string? JwtKey { get; set; }

    /// <summary>
    /// Jwt expire days
    /// </summary>
    public int JwtExpireDays { get; set; }

    /// <summary>
    /// Jwt issuer
    /// </summary>
    public  string? JwtIssuer { get; set; }
}
