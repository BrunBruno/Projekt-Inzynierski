
namespace chess.Application.Requests.GameRequests.GetTypeHistory;

public class GetTypeHistoryDto {
    public int Moves { get; set; }
    public bool? IsWinner { get; set; }
    public int EloGained { get; set; }
    public DateTime CreatedAt { get; set; }
}
