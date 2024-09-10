
namespace chess.Application.Requests.GameRequests.CreateGameWithLink;

/// <summary>
/// Dto returned after creating game with url
/// </summary>
public class CreateGameWithLinkDto {

    /// <summary>
    /// Game id
    /// </summary>
    public Guid GameId { get; set; }

    /// <summary>
    /// Url for awaiting page
    /// </summary>
    public required string GameUrl { get; set; }
}
