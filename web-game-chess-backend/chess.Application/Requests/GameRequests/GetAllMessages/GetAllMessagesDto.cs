
using chess.Core.Dtos;
using chess.Core.Enums;

namespace chess.Application.Requests.GameRequests.GetAllMessages;

/// <summary>
/// Dto representing game message
/// </summary>
public class GetAllMessagesDto {

    /// <summary>
    /// Message content
    /// </summary>
    public required string Message { get; set; }

    /// <summary>
    /// Sender user username
    /// </summary>
    public required string SenderName { get; set; }

    /// <summary>
    /// Sender user profile picture
    /// </summary>
    public ImageDto? SenderImage { get; set; }

    /// <summary>
    /// In case of draw message requestor name
    /// </summary>
    public string? RequestorName { get; set; } = null;

    /// <summary>
    /// Date of creation
    /// </summary>
    public DateTime SentAt { get; set; }

    /// <summary>
    /// Message type
    /// </summary>
    public MessageType Type { get; set; }
}
