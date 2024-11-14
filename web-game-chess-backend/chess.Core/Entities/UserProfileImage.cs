
using chess.Core.Abstraction;

namespace chess.Core.Entities;
#pragma warning disable CS8618


/// <summary>
/// Entity of user profile image
/// </summary>
public class UserProfileImage : Image {

    /// <summary>
    /// Id
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// User id
    /// </summary>
    public Guid UserId { get; set; }

    /// <summary>
    /// User
    /// </summary>
    public User User { get; set; }
}
