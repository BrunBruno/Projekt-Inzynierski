
using chess.Core.Enums;

namespace chess.Application.Requests.EngineRequests.GetAllEngineGameMessages;

/// <summary>
/// Dto representing game message
/// </summary>
public class GetAllEngineGameMessagesDto {

    /// <summary>
    /// Message content
    /// </summary>
    public required string Message { get; set; }

    /// <summary>
    /// Constant sender name
    /// </summary>
    public string SenderName { get; set; } = "Chess BRN";

    /// <summary>
    /// Date of creation
    /// </summary>
    public DateTime SentAt { get; set; }

    /// <summary>
    /// Message type
    /// </summary>
    public MessageType Type { get; set; }
}
