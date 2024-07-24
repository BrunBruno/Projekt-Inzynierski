
using MediatR;

namespace chess.Application.Requests.GameRequests.SendMessage;

/// <summary>
/// Request to create new messages
/// </summary>
public class SendMessageRequest : IRequest {

    /// <summary>
    /// Id of current game
    /// </summary>
    public Guid GameId { get; set; }

    /// <summary>
    /// Id of current player
    /// </summary>
    public Guid PlayerId { get; set; }

    /// <summary>
    /// Message content
    /// </summary>
    public required string Message { get; set; }
}
