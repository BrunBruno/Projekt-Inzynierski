
using chess.Core.Enums;

namespace chess.Core.Dtos;

/// <summary>
/// General player data
/// </summary>
public class PlayerDto {

    /// <summary>
    /// User name
    /// </summary>
    public required string Name { get; set; }

    /// <summary>
    /// Elo points for one game timing type
    /// </summary>
    public int Elo { get; set; }

    /// <summary>
    /// Side color of player
    /// </summary>
    public PieceColor Color { get; set; }

    /// <summary>
    /// Avatar image
    /// </summary>
    public ImageDto? ProfilePicture { get; set; }
}
