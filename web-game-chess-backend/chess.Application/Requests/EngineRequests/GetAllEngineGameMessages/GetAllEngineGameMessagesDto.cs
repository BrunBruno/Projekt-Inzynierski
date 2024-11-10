
using chess.Core.Dtos;
using chess.Core.Enums;

namespace chess.Application.Requests.EngineRequests.GetAllEngineGameMessages;

/// <summary>
/// 
/// </summary>
public class GetAllEngineGameMessagesDto {

    /// <summary>
    /// Message content
    /// </summary>
    public required string Message { get; set; }

    /// <summary>
    /// 
    /// </summary>
    public required string SenderName { get; set; }

    /// <summary>
    /// Date of creation
    /// </summary>
    public DateTime SentAt { get; set; }

    /// <summary>
    /// Message type
    /// </summary>
    public MessageType Type { get; set; }
}
