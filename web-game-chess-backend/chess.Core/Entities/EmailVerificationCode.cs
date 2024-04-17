

namespace chess.Core.Entities;

public class EmailVerificationCode {
    /// <summary>
    /// Code id.
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// User id.
    /// </summary>
    public Guid UserId { get; set; }

    /// <summary>
    /// User.
    /// </summary>
    public User User { get; set; }

    /// <summary>
    /// Hashed code used for verifying user email.
    /// </summary>
    public string CodeHash { get; set; }

    /// <summary>
    /// Date when code expires.
    /// </summary>
    public DateTime ExpirationDate { get; set; }
}