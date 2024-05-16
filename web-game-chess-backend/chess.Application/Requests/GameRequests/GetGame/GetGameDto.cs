
namespace chess.Application.Requests.GameRequests.GetGame;
#pragma warning disable CS8618

public class GetGameDto {

    public string Position { get; set; }
    public int Turn { get; set; }
    public DateTime CreatedAt { get; set; }

    // from game timing
    public int Duration { get; set; }
    public int Increment { get; set; }

    // from game state
    public string? EnPassant { get; set; }
    public bool CanWhiteKingCastle { get; set; } 
    public bool CanWhiteShortRookCastle { get; set; } 
    public bool CanWhiteLongRookCastle { get; set; } 
    public bool CanBlackKingCastle { get; set; } 
    public bool CanBlackShortRookCastle { get; set; } 
    public bool CanBlackLongRookCastle { get; set; } 

    public GetGamePlayerDto WhitePlayer { get; set; }
    public GetGamePlayerDto BlackPlayer { get; set; }

    public List<GetGameMoveDto> Moves { get; set; }

}

public class GetGamePlayerDto {
    public string Name { get; set; }
    public string? ImageUrl { get; set; }
    public int Elo { get; set; }
}

public class GetGameMoveDto {
    public string Move { get; set; }
    public int Turn { get; set; }
}

