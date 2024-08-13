
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
    public string? SenderImage { get; set; }

    /// <summary>
    /// Date of creation
    /// </summary>
    public DateTime SentAt { get; set; }
}
