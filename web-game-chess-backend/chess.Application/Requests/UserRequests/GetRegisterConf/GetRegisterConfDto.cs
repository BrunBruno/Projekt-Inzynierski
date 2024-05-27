
namespace chess.Application.Requests.UserRequests.GetRegisterConf;

/// <summary>
/// DTO for registration configurations
/// </summary>
public class GetRegisterConfDto {

    /// <summary>
    /// Minimal length of field
    /// </summary>
    public int? MinLength { get; set; }

    /// <summary>
    /// Maximal length of field
    /// </summary>
    public int? MaxLength { get; set; }

    /// <summary>
    /// Is uppercase in field required
    /// </summary>
    public bool RequireUppercase { get; set; }

    /// <summary>
    /// Is lowercase in field  required
    /// </summary>
    public bool RequireLowercase { get; set; }

    /// <summary>
    /// Is digit in filed required
    /// </summary>
    public bool RequireDigit { get; set; }

    /// <summary>
    /// Is special character in field required
    /// </summary>
    public bool RequireSpecialChar { get; set; }
}
