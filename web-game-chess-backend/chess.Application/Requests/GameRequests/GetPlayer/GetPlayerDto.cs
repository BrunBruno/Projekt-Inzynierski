
using chess.Core.Enums;

namespace chess.Application.Requests.GameRequests.GetPlayer; 

/// <summary>
/// Dto represent player of current game
/// </summary>
public class GetPlayerDto {

    /// <summary>
    /// User name
    /// </summary>
    public required string Name { get; set; }

    /// <summary>
    /// Elo points
    /// </summary>
    public int Elo { get; set; }

    /// <summary>
    /// Color
    /// </summary>
    public Colors Color { get; set; }
}
