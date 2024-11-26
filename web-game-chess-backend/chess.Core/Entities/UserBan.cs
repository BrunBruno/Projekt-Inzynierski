
#pragma warning disable CS8618
namespace chess.Core.Entities;


/// <summary>
/// Banned user entity
/// </summary>
public class UserBan {

    /// <summary>
    /// Id pk
    /// </summary>
    public Guid Id { get; set; }


    /// <summary>
    /// Reason for ban
    /// </summary>
    public required string Reason { get; set; }

    /// <summary>
    /// Is for ever
    /// </summary>
    public bool IsForEver { get; set; }

    /// <summary>
    /// Duration if not for ever
    /// </summary>
    public TimeSpan? Duration { get; set; }


    /// <summary>
    /// Banned user
    /// </summary>
    public Guid UserId { get; set; }
    public User User { get; set; }
}
