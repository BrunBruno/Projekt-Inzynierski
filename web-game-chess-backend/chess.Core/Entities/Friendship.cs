
using chess.Core.Enums;

namespace chess.Core.Entities;

public class Friendship {
    public Guid Id { get; set; }
    public FriendshipStatus Status { get; set; }

    public DateTime RequestCreatedAt { get; set; }
    public DateTime RequestRespondedAt { get; set; }
    

    public Guid RequestorId { get; set; }
    public User Requestor { get; set; }
    public Guid ReceiverId { get; set; }
    public User Receiver { get; set; }

}
