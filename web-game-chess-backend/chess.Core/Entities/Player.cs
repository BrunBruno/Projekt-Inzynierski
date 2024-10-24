﻿
using chess.Core.Enums;

namespace chess.Core.Entities;
#pragma warning disable CS8618

/// <summary>
/// Player entity for user 
/// Only two player of different users for one game
/// </summary>
public class Player {

    /// <summary>
    /// Id
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// User name
    /// </summary>
    public required string Name { get; set; }

    /// <summary>
    /// Elo points
    /// </summary>
    public int Elo { get; set;  }

    /// <summary>
    /// Color of player (black or white)
    /// Null when player is still searching for a game
    /// </summary>
    public PieceColor? Color { get; set; } = null;

    /// <summary>
    /// Determines if player can be used in global search or is only for private game
    /// </summary>
    public bool IsPrivate { get; set; } = false;

    /// <summary>
    /// Flag if player is still searching
    /// </summary>
    public bool IsPlaying { get; set; } = false;

    /// <summary>
    /// Flag if game for player has been ended
    /// </summary>
    public bool FinishedGame { get; set; } = false;

    /// <summary>
    /// Creating of player
    /// To arrange waiting queue
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Time left fro all moves according to game timing
    /// </summary>
    public double TimeLeft { get; set; }

    /// <summary>
    /// User id
    /// </summary>
    public Guid UserId { get; set; }

    /// <summary>
    /// User for which player belong to
    /// </summary>
    public User User {  get; set; } 

    /// <summary>
    /// Game id
    /// </summary>
    public Guid GameId { get; set; }

    /// <summary>
    /// Game in which player is playing as white
    /// null if playing as black
    /// </summary>
    public Game WhiteGame { get; set; }

    /// <summary>
    /// Game in which player is playing as black
    /// Null if playing as white
    /// </summary>
    public Game BlackGame { get; set; }

    /// <summary>
    /// Timing id, to get duration and increment for all moves
    /// </summary>
    public Guid TimingId { get; set; }

    /// <summary>
    /// All messages sent durning game
    /// </summary>
    public List<PlayerMessage> Messages { get; set; }
}
