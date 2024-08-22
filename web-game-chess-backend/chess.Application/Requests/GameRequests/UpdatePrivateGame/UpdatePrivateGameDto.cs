
namespace chess.Application.Requests.GameRequests.UpdatePrivateGame;

public class UpdatePrivateGameDto {
    public bool ShouldStart { get; set; }
    public Guid WhitePlayerUserId { get; set; }
    public Guid BlackPlayerUserId { get; set; }
}
