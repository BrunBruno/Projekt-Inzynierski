
namespace chess.Core.Entities;

/// <summary>
/// Data configuration entity
/// </summary>
public class UserDataConfiguration {

    /// <summary>
    /// Configuration id pk
    /// </summary>
    public int Id { get; set; }


    /// <summary>
    /// Minimal field length
    /// </summary>
    public int? MinLength { get; set; }

    /// <summary>
    /// Maximal field length
    /// </summary>
    public int? MaxLength { get; set; }

    /// <summary>
    /// Is uppercase required
    /// </summary>
    public bool RequireUppercase {  get; set; }

    /// <summary>
    /// Is lowercase required
    /// </summary>
    public bool RequireLowercase { get; set; }

    /// <summary>
    /// Is digit required
    /// </summary>
    public bool RequireDigit { get; set; }

    /// <summary>
    /// Is special character required
    /// </summary>
    public bool RequireSpecialChar { get; set; }
}
