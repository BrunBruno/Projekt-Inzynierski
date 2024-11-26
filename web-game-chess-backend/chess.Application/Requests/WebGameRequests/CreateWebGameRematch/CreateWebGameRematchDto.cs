
namespace chess.Application.Requests.WebGameRequests.CreateWebGameRematch;

/// <summary>
/// Ids returned after taking rematch
/// </summary>
public class CreateWebGameRematchDto {

    /// <summary>
    /// Opponent username
    /// </summary>
    public required string OpponentName { get; set; }

    /// <summary>
    /// Game id
    /// </summary>
    public Guid GameId { get; set; }
}
