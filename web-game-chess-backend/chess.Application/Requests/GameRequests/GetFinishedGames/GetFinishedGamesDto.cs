
using chess.Core.Enums;

namespace chess.Application.Requests.GameRequests.GetFinishedGames;

public class GetFinishedGamesDto {
    public required string Position { get; set; }
    public int Turn { get; set; }
    public DateTime CreatedAt { get; set; }
    public Colors? WinnerColor { get; set; }

    public required GetFinishedGamesPlayerDto WhitePlayer { get; set; }
    public required GetFinishedGamesPlayerDto BlackPlayer { get; set; }
}

public class GetFinishedGamesPlayerDto {
    public required string Name { get; set; }
    public string? ImageUrl { get; set; }

    public int Elo { get; set; }
    public Colors? Color { get; set; } = null;
}