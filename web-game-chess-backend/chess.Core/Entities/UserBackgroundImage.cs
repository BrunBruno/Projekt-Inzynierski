
using chess.Core.Abstraction;

namespace chess.Core.Entities;
#pragma warning disable CS8618

public class UserBackgroundImage : Image {

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
