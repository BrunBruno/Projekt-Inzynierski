﻿
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
    public int Elo { get; set;  }

    /// <summary>
    /// 
    /// </summary>
    public Colors? Color { get; set; }

    /// <summary>
    /// 
    /// </summary>
    public bool IsPlaying { get; set; }

    /// <summary>
    /// 
    /// </summary>
    public DateTime CreatedAt { get; set; }

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
