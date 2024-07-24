
namespace chess.Core.Entities;
#pragma warning disable CS8618

/// <summary>
/// Message entity
/// </summary>
public class Message {

    /// <summary>
    /// Id
    /// </summary>
    public Guid Id {  get; set; }

    /// <summary>
    /// Message content
    /// </summary>
    public required string Content { get; set; }

    /// <summary>
    /// When message was sent/created
    /// </summary>
    public DateTime SentAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Player id
    /// </summary>
    public Guid PlayerId { get; set; }

    /// <summary>
    /// Player who sent the message
    /// </summary>
    public Player Player { get; set; }
}
