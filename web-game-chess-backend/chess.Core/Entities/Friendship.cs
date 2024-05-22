
using chess.Core.Enums;

namespace chess.Core.Entities;
#pragma warning disable CS8618

public class Friendship {
    public Guid Id { get; set; }
    public FriendshipStatus Status { get; set; }
    public DateTime RequestCreatedAt { get; set; }
    public DateTime? RequestRespondedAt { get; set; } = null;
    public Guid RequestorId { get; set; }
    public User Requestor { get; set; }
    public Guid ReceiverId { get; set; }
    public User Receiver { get; set; }

}
