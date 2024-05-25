
namespace chess.Api.Models.GameModels;

public class NotifyUserModel {
    public Guid FriendId { get; set; }
    public Guid GameId { get; set; }
    public required string Inviter { get; set; }
}
