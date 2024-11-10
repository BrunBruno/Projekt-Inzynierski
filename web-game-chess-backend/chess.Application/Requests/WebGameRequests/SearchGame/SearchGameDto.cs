
namespace chess.Application.Requests.WebGameRequests.SearchGame;

/// <summary>
/// Dto returned to get ids for created or gotten player and timing
/// </summary>
public class SearchGameDto {

    /// <summary>
    /// Timing id
    /// </summary>
    public Guid TimingId { get; set; }

    /// <summary>
    /// Player id
    /// </summary>
    public Guid PlayerId { get; set; }
}
