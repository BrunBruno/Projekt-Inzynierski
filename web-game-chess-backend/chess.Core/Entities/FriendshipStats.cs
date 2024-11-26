
namespace chess.Core.Entities;
#pragma warning disable CS8618

public class FriendshipStats {

    /// <summary>
    /// Id pk
    /// </summary>
    public Guid Id { get; set; }


    /// <summary>
    /// Wins of friendship requestor
    /// </summary>
    public int RequestorWins { get; set; } = 0;

    /// <summary>
    /// Loses of friendship requestor
    /// </summary>
    public int RequestorLoses { get; set; } = 0;

    /// <summary>
    /// Draws of friendship requestor
    /// </summary>
    public int RequestorDraws { get; set; } = 0;

    /// <summary>
    /// Total games played in relationship
    /// </summary>
    public int GamesPlayed => RequestorWins + RequestorLoses + RequestorDraws;


    /// <summary>
    /// Game statistic within friendship
    /// </summary>
    public Guid FreindshipId { get; set; }
    public Friendship Friendship { get; set; }
}
