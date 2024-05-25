
namespace chess.Application.Requests.GameRequests.CreatePrivateGame;

public class CreatePrivateGameDto {
    public Guid FriendId { get; set; }
    public Guid GameId { get; set; }
    public required string Inviter {  get; set; }
}
