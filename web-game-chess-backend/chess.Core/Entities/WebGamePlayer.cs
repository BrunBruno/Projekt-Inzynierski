
using chess.Core.Abstraction;

namespace chess.Core.Entities;
#pragma warning disable CS8618

/// <summary>
/// Player entity for user 
/// Only two player of different users for one game
/// </summary>
public class WebGamePlayer : Player {

    /// <summary>
    /// Id pk
    /// </summary>
    public Guid Id { get; set; }


    /// <summary>
    /// Determines if player can be used in global search or is only for private game
    /// </summary>
    public bool IsPrivate { get; set; } = false;

    /// <summary>
    /// Flag if player is still searching
    /// </summary>
    public bool IsPlaying { get; set; } = false;

    /// <summary>
    /// For games with link, to create temporary player to update
    /// </summary>
    public bool IsTemp { get; set; } = false;

    /// <summary>
    /// Flag if game for player has been ended
    /// </summary>
    public bool FinishedGame { get; set; } = false;

    /// <summary>
    /// Elo points for specific timing type
    /// </summary>
    public int Elo { get; set; }

    /// <summary>
    /// Timing id, to get duration and increment for all moves
    /// </summary>
    public Guid TimingId { get; set; }


    /// <summary>
    /// User for which player belong to
    /// </summary>
    public Guid UserId { get; set; }
    public User User {  get; set; } 


    /// <summary>
    /// Game id
    /// </summary>
    public Guid GameId { get; set; }

    /// <summary>
    /// Game in which player is playing as white
    /// null if playing as black
    /// </summary>
    public WebGame? WhiteGame { get; set; }

    /// <summary>
    /// Game in which player is playing as black
    /// Null if playing as white
    /// </summary>
    public WebGame? BlackGame { get; set; }


    /// <summary>
    /// All messages sent durning game
    /// </summary>
    public List<WebGamePlayerMessage> Messages { get; set; }
}
