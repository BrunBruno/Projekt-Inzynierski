
using chess.Core.Models;

namespace chess.Api.Models.WebGameModels;

public class NotifyUserModel : TimingTypeModel {
    public Guid GameId { get; set; }
    public Guid FriendId { get; set; }
    public required string Inviter { get; set; }
}
