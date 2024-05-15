
namespace chess.Application.Requests.GameRequests.GetGame;
#pragma warning disable CS8618

/// <summary>
/// 
/// </summary>
public class GetGameDto {

    /// <summary>
    /// 
    /// </summary>
    public string Position { get; set; }

    /// <summary>
    /// 
    /// </summary>
    public int Turn { get; set; }

    /// <summary>
    /// 
    /// </summary>
    public DateTime CreatedAt { get; set; }

    /// <summary>
    /// 
    /// </summary>
    public int Duration { get; set; }

    /// <summary>
    /// 
    /// </summary>
    public int Increment { get; set; }

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

