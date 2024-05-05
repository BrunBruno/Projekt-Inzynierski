
namespace chess.Infrastructure.Options;

/// <summary>
/// Settings for Smtp service
/// </summary>
public class SmtpOptions {

    /// <summary>
    /// Service provider
    /// </summary>
    public string? Host {  get; set; }

    /// <summary>
    /// Port
    /// </summary>
    public int Port { get; set; }

    /// <summary>
    /// Is ssl enabled
    /// </summary>
    public bool EnableSsl { get; set; }

    /// <summary>
    /// Company email
    /// </summary>
    public string? FromMail { get; set; }

    /// <summary>
    /// Company email password
    /// </summary>
    public string? FromPassword { get; set; }

    /// <summary>
    /// Email content
    /// </summary>
    public string? Body { get; set; }
}
