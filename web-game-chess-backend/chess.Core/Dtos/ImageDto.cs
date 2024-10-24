
namespace chess.Core.Dtos;

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
