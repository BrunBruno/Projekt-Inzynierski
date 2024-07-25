
using chess.Core.Enums;

namespace chess.Api.Models.GameModels;

public class NotifyUserModel {
    public Guid FriendId { get; set; }
    public Guid GameId { get; set; }
    public required string Inviter { get; set; }
    public TimingTypes Type { get; set; }
    public int Minutes { get; set; }
    public int Increment { get; set; }
}
