
namespace chess.Application.Requests.GameRequests.CreateGameByEmail;

public class CreateGameByEmailDto {
    public Guid FriendId { get; set; }
    public Guid GameId { get; set; }
    public required string Inviter { get; set; }
}
