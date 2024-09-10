
namespace chess.Application.Requests.GameRequests.UpdatePrivateGame;

/// <summary>
/// Update game dto
/// </summary>
public class UpdatePrivateGameDto {

    /// <summary>
    /// Flag if game should start
    /// </summary>
    public bool ShouldStart { get; set; }

    /// <summary>
    /// User playing as white id
    /// </summary>
    public Guid WhitePlayerUserId { get; set; }

    /// <summary>
    /// User playing as black id
    /// </summary>
    public Guid BlackPlayerUserId { get; set; }
}
