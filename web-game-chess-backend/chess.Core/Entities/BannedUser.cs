
namespace chess.Core.Entities;
#pragma warning disable CS8618


/// <summary>
/// Banned user entity
/// </summary>
public class BannedUser {

    /// <summary>
    /// Banned user id
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// Reason for ban
    /// </summary>
    public string Reason { get; set; }

    /// <summary>
    /// Is for ever
    /// </summary>
    public bool IsForEver { get; set; }

    /// <summary>
    /// Duration if not for ever
    /// </summary>
    public TimeSpan? Duration { get; set; }

    /// <summary>
    /// User id
    /// </summary>
    public Guid UserId { get; set; }

    /// <summary>
    /// User
    /// </summary>
    public User User { get; set; }
}
