
namespace chess.Core.Abstraction;

/// <summary>
/// Abstract image entity
/// </summary>
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
