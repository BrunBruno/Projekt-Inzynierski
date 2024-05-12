
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
    public DateTime CreatedAt { get; set; }

    /// <summary>
    /// 
    /// </summary>
    public int Duration { get; set; }

    /// <summary>
    /// 
    /// </summary>
    public int Increment { get; set; }

    /// <summary>
    /// 
    /// </summary>
    public GetGamePlayerDto WhitePlayer { get; set; }

    /// <summary>
    /// 
    /// </summary>
    public GetGamePlayerDto BlackPlayer { get; set; }
}

/// <summary>
/// 
/// </summary>
public class GetGamePlayerDto {

    /// <summary>
    /// 
    /// </summary>
    public string Name { get; set; }

    /// <summary>
    /// 
    /// </summary>
    public int Elo { get; set; }
}
