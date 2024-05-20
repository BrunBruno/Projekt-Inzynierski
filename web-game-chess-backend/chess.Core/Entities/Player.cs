
using chess.Core.Enums;

namespace chess.Core.Entities;
#pragma warning disable CS8618

public class Player {

    /// <summary>
    /// 
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// 
    /// </summary>
    public string Name { get; set; }

    /// <summary>
    /// 
    /// </summary>
    public string? ImageUrl { get; set; }

    /// <summary>
    /// 
    /// </summary>
    public int Elo { get; set;  }

    /// <summary>
    /// 
    /// </summary>
    public Colors? Color { get; set; } = null;

    /// <summary>
    /// 
    /// </summary>
    public bool IsPlaying { get; set; } = false;

    /// <summary>
    /// 
    /// </summary>
    public bool FinishedGame { get; set; } = false;

    /// <summary>
    /// 
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// 
    /// </summary>
    public double TimeLeft { get; set; }

    /// <summary>
    /// 
    /// </summary>
    public Guid UserId { get; set; }

    /// <summary>
    /// 
    /// </summary>
    public User User {  get; set; } 

    /// <summary>
    /// 
    /// </summary>
    public Guid GameId { get; set; }

    /// <summary>
    /// 
    /// </summary>
    public Game WhiteGame { get; set; }

    /// <summary>
    /// 
    /// </summary>
    public Game BlackGame { get; set; }

    /// <summary>
    /// 
    /// </summary>
    public Guid TimingId { get; set; }
}
