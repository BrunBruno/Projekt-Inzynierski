
namespace chess.Application.Requests.WebGameRequests.CreatePrivateGame;

/// <summary>
/// Dto returned after creating private game
/// </summary>
public class CreatePrivateGameDto {

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
    public required string Inviter {  get; set; }
}
