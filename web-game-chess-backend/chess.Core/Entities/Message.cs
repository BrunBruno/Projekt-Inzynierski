
using chess.Core.Enums;

namespace chess.Core.Entities;

/// <summary>
/// Message entity
/// </summary>
public abstract class Message {

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
    /// Determines purpose of message
    /// </summary>
    public MessageType Type { get; set; }
}
