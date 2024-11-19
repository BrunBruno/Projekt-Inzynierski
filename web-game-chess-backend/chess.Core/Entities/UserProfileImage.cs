
using chess.Core.Abstraction;

namespace chess.Core.Entities;
#pragma warning disable CS8618

/// <summary>
/// User profile image
/// </summary>
public class UserProfileImage : Image {

    /// <summary>
    /// Id pk
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// User
    /// </summary>
    public Guid UserId { get; set; }
    public User User { get; set; }
}
