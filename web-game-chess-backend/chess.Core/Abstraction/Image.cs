
namespace chess.Core.Abstraction;

public abstract class Image {

    /// <summary>
    /// File in bytes
    /// </summary>
    public required byte[] Data { get; set; }

    /// <summary>
    /// Content type
    /// </summary>
    public required string ContentType { get; set; }

}
