
using chess.Core.Enums;

namespace chess.Core.Entities;
#pragma warning disable CS8618

/// <summary>
/// Friendship relation between two users
/// </summary>
public class Friendship {

    /// <summary>
    /// Id pk
    /// </summary>
    public Guid Id { get; set; }


    /// <summary>
    /// Status of friendship
    /// </summary>
    public FriendshipStatus Status { get; set; }

    /// <summary>
    /// When friendship was created/requested
    /// </summary>
    public DateTime RequestCreatedAt { get; set; }

    /// <summary>
    /// When other user responded to friendship request
    /// </summary>
    public DateTime? RequestRespondedAt { get; set; } = null;


    /// <summary>
    /// Game statistic within friendship
    /// </summary>
    public FriendshipStats Stats { get; set; }


    /// <summary>
    /// User that requested to be friend of other user
    /// </summary>
    public Guid RequestorId { get; set; }
    public User Requestor { get; set; }


    /// <summary>
    /// User that gets friendship request
    /// </summary>
    public Guid ReceiverId { get; set; }
    public User Receiver { get; set; }
}
