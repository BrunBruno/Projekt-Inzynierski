
namespace chess.Application.Requests.GameRequests.CreateGameWithLink;

public class CreateGameWithLinkDto {

    /// <summary>
    /// 
    /// </summary>
    public Guid GameId { get; set; }

    /// <summary>
    /// 
    /// </summary>
    public required string GameUrl { get; set; }
}
