
namespace chess.Application.Requests.GameRequests.GetTypeHistory;

public class GetTypeHistoryDto {
    public string WhitePlayer { get; set; }
    public string BlackPlayer { get; set; }
    public int Moves { get; set; }
    public bool? IsWinner { get; set; }
    public int PrevElo { get; set; }
    public DateTime CreatedAt { get; set; }
}
