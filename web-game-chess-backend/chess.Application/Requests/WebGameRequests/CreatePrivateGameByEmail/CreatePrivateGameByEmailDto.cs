
namespace chess.Application.Requests.WebGameRequests.CreatePrivateGameByEmail;

/// <summary>
/// Dto returned after creating private game
/// </summary>
public class CreatePrivateGameByEmailDto {

    /// <summary>
    /// Obtained friend id
    /// </summary>
    public Guid FriendId { get; set; }

    /// <summary>
    /// Created game id
    /// </summary>
    public Guid GameId { get; set; }

    /// <summary>
    /// Inviter username
    /// </summary>
    public required string Inviter { get; set; }
}
