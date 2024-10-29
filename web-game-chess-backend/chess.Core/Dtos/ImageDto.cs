
namespace chess.Core.Dtos;

/// <summary>
/// General user image dto
/// </summary>
public class ImageDto {

    /// <summary>
    /// File data
    /// </summary>
    public required byte[] Data { get; set; }

    /// <summary>
    /// Content type
    /// </summary>
    public required string ContentType { get; set; }
}
