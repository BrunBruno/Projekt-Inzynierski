
namespace chess.Application.Requests.GameRequests.GetGame;

public class GetGameDto {
    public string Position { get; set; }
    public DateTime CreatedAt { get; set; }
    public int Duration { get; set; }
    public int Increment { get; set; }

    public GetGamePlayerDto WhitePlayer { get; set; }
    public GetGamePlayerDto BlackPlayer { get; set; }
}

public class GetGamePlayerDto {
    public string Name { get; set; }
    public int Elo { get; set; }
}
