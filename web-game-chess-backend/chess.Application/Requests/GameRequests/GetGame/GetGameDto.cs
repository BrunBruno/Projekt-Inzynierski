
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

}

