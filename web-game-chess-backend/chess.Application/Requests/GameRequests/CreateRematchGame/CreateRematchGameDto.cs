
namespace chess.Application.Requests.GameRequests.CreateRematchGame;

public class CreateRematchGameDto {
    public Guid OpponentId { get; set; }
    public Guid GameId { get; set; }
}
