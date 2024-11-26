
namespace chess.Application.Requests.EngineRequests.GetEngineGameMove;

/// <summary>
/// Dto representing move done by engine
/// </summary>
public class GetEngineGameMoveDto {

    /// <summary>
    /// If engine does not produce move, then this value is set to true
    /// </summary>
    public bool ShouldEnd { get; set; } = false;

    /// <summary>
    /// Move from coordinates
    /// </summary>
    public required string OldCoordinates {  get; set; }

    /// <summary>
    /// Move to coordinates
    /// </summary>
    public required string NewCoordinates { get; set; }

    /// <summary>
    /// If promotion happened
    /// </summary>
    public string? PromotedPiece { get; set; }
}
