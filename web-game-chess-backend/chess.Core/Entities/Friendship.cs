
using chess.Core.Enums;

namespace chess.Core.Entities;
#pragma warning disable CS8618

/// <summary>
/// Friendship relation between two users
/// </summary>
public class Friendship {

    /// <summary>
    /// Id
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
    /// Wins of friendship requestor
    /// </summary>
    public int RequestorWins { get; set; } = 0;

    /// <summary>
    /// Loses of friendship requestor
    /// </summary>
    public int RequestorLoses { get; set; } = 0;

    /// <summary>
    /// Draws of friendship requestor
    /// </summary>
    public int RequestorDraws { get; set; } = 0;

    /// <summary>
    /// Total games played in relationship
    /// </summary>
    public int GamesPlayed => RequestorWins + RequestorLoses + RequestorDraws;

    /// <summary>
    /// Requestor id
    /// </summary>
    public Guid RequestorId { get; set; }

    /// <summary>
    /// User that requested to be friend of other user
    /// </summary>
    public User Requestor { get; set; }

    /// <summary>
    /// Receiver id
    /// </summary>
    public Guid ReceiverId { get; set; }

    /// <summary>
    /// User that gets friendship request
    /// </summary>
    public User Receiver { get; set; }

}
