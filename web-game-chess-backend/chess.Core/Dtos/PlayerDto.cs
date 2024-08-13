
namespace chess.Core.Dtos;

/// <summary>
/// Player data
/// </summary>
public class PlayerDto {

    /// <summary>
    /// User name
    /// </summary>
    public required string Name { get; set; }

    /// <summary>
    /// Avatar image
    /// </summary>
    public string? ImageUrl { get; set; }

    /// <summary>
    /// Elo points for one game timing type
    /// </summary>
    public int Elo { get; set; }
}
